import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@mui/material';
import { TickCircle, InfoCircle, DocumentUpload } from 'iconsax-react';
import ReusableModal from 'components/modal/reusable';
import { useBulkUploadGeneralSchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const BulkSchoolModal = ({ open, onClose, refetchSchools }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedSchools, setParsedSchools] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef(null);

  const bulkUploadMutation = useBulkUploadGeneralSchool();

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      parseCSVFile(file);
    }
  }, []);

  const parseCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          setError('CSV file must contain at least a header row and one data row');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
        const schools = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV parsing - handles quoted fields
          const values = [];
          let current = '';
          let inQuotes = false;

          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          const school = {
            name: '',
            code: '',
            address: '',
            adminName: '',
            adminEmail: '',
            adminPhone: '',
            status: 'valid',
            errors: []
          };

          // Map CSV columns to school properties
          headers.forEach((header, index) => {
            const value = values[index]?.replace(/"/g, '') || '';
            switch (header) {
              case 'name':
              case 'school name':
                school.name = value;
                break;
              case 'code':
              case 'school code':
                school.code = value;
                break;
              case 'address':
              case 'school address':
                school.address = value;
                break;
              case 'adminname':
              case 'admin name':
                school.adminName = value;
                break;
              case 'adminemail':
              case 'admin email':
                school.adminEmail = value;
                break;
              case 'adminphone':
              case 'admin phone':
                school.adminPhone = value;
                break;
            }
          });

          // Validate required fields
          const requiredFields = [
            { field: 'name', label: 'School Name' },
            { field: 'code', label: 'School Code' },
            { field: 'address', label: 'Address' },
            { field: 'adminName', label: 'Admin Name' },
            { field: 'adminEmail', label: 'Admin Email' },
            { field: 'adminPhone', label: 'Admin Phone' }
          ];

          requiredFields.forEach(({ field, label }) => {
            if (!school[field]) {
              school.errors.push(`Missing ${label}`);
            }
          });

          // Validate email format
          if (school.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(school.adminEmail)) {
            school.errors.push('Invalid email format');
          }

          // Validate phone format (basic validation)
          if (school.adminPhone && !/^[0-9+\-\s()]{10,}$/.test(school.adminPhone)) {
            school.errors.push('Invalid phone format');
          }

          // Validate school code format (basic validation - no spaces, reasonable length)
          if (school.code && (school.code.includes(' ') || school.code.length < 2)) {
            school.errors.push('Invalid school code format');
          }

          if (school.errors.length > 0) {
            school.status = 'error';
          }

          schools.push(school);
        }

        setParsedSchools(schools);
        setPage(0); // Reset pagination when new data is loaded
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setError('Failed to parse CSV file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = useCallback(() => {
    const sampleData = [
      ['name', 'code', 'address', 'adminName', 'adminEmail', 'adminPhone'],
      ['Ghana Senior High School', 'GHANASCO-02', 'Tamale, Hospital Rd', 'Abdul Rahman', 'abdulrahman@gmail.com', '0595833503'],
      ['Achimota School', 'ACHIM-01', 'Accra, Achimota', 'Jane Doe', 'jane.doe@achimota.edu.gh', '0244567890'],
      ['Prempeh College', 'PRECO-01', 'Kumasi, Sofoline', 'John Smith', 'john.smith@prempeh.edu.gh', '0201234567']
    ];

    const csvContent = sampleData.map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school_bulk_upload_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || validSchools.length === 0) {
      setError('Please select a valid CSV file with at least one valid school');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      bulkUploadMutation.mutate(formData, {
        onSuccess: (response) => {
          const successCount = response?.data?.successCount || validSchools.length;
          const errorCount = response?.data?.errorCount || 0;

          let message = 'Bulk upload completed successfully';
          if (successCount > 0 && errorCount > 0) {
            message = `Bulk upload completed: ${successCount} schools registered, ${errorCount} failed`;
          } else if (successCount > 0) {
            message = `${successCount} schools registered successfully`;
          }

          dispatch(
            openSnackbar({
              open: true,
              message,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );

          refetchSchools();
          handleClose();
        },
        onError: (err) => {
          console.error('Upload error:', err);
          setError(err?.response?.data?.message || err?.message || 'Failed to upload schools. Please try again.');
        }
      });
    } catch (err) {
      console.error('Error creating FormData:', err);
      setError('Failed to prepare file for upload. Please try again.');
    }
  }, [selectedFile, parsedSchools, bulkUploadMutation, refetchSchools]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setParsedSchools([]);
    setError('');
    setPage(0);
    onClose();
  }, [onClose]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validSchools = parsedSchools.filter((s) => s.status === 'valid');
  const errorSchools = parsedSchools.filter((s) => s.status === 'error');
  const isLoading = bulkUploadMutation.isLoading;

  const renderContent = () => (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Alert icon={<InfoCircle size={20} variant="Bold" />} severity="info" sx={{ mb: 3 }}>
        Super Admins can bulk register schools via CSV.{' '}
        <Button
          variant="text"
          size="small"
          onClick={handleDownloadSample}
          disabled={isLoading}
          sx={{ textDecoration: 'underline', p: 0, minWidth: 'auto' }}
        >
          Download a sample file
        </Button>{' '}
        or choose a file to upload.
      </Alert>

      <Box
        sx={{
          border: '2px dashed',
          borderColor: selectedFile ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          mb: 3,
          backgroundColor: selectedFile ? 'primary.50' : 'grey.50',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv" style={{ display: 'none' }} disabled={isLoading} />
        <DocumentUpload size={48} variant="Bold" color="#1976d2" style={{ marginBottom: 16 }} />
        <Typography variant="h6" gutterBottom>
          {selectedFile ? selectedFile.name : 'Choose a CSV file'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedFile ? 'Click to select a different file' : 'Click to browse or drag and drop your CSV file here'}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} disabled={isLoading}>
          Browse Files
        </Button>
      </Box>

      {parsedSchools.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={<TickCircle size={16} variant="Bold" />}
              label={`${validSchools.length} Valid`}
              color="success"
              variant="outlined"
            />
            {errorSchools.length > 0 && (
              <Chip
                icon={<InfoCircle size={16} variant="Bold" />}
                label={`${errorSchools.length} Errors`}
                color="error"
                variant="outlined"
              />
            )}
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>School Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Admin Name</TableCell>
                  <TableCell>Admin Email</TableCell>
                  <TableCell>Admin Phone</TableCell>
                  <TableCell>Errors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedSchools.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((school, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip size="small" label={school.status} color={school.status === 'valid' ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.code}</TableCell>
                    <TableCell>{school.address}</TableCell>
                    <TableCell>{school.adminName}</TableCell>
                    <TableCell>{school.adminEmail}</TableCell>
                    <TableCell>{school.adminPhone}</TableCell>
                    <TableCell>
                      {school.errors.length > 0 && (
                        <Typography variant="caption" color="error">
                          {school.errors.join(', ')}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={parsedSchools.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={handleClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="upload"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!selectedFile || validSchools.length === 0 || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
      sx={{ minWidth: 120 }}
    >
      {isLoading ? 'Enrolling...' : `Enroll ${validSchools.length} Schools`}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={handleClose}
      title="Register Bulk Schools"
      description="Register multiple schools in the TEMVO system."
      actions={actions}
      ariaLabelledBy="register-bulk-schools-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default BulkSchoolModal;
