/* eslint-disable no-unused-vars */

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Link,
  DialogActions,
  LinearProgress,
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

export function BulkVendorsContent({ onAction, loading, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedVendors, setParsedVendors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          console.error('CSV file must contain at least a header row and one data row');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
        const vendors = [];

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

          const vendor = {
            name: '',
            phone: '',
            email: '',
            address: '',
            status: 'valid',
            errors: []
          };

          // Map CSV columns to vendor properties
          headers.forEach((header, index) => {
            const value = values[index]?.replace(/"/g, '') || '';
            switch (header) {
              case 'name':
              case 'vendor name':
                vendor.name = value;
                break;
              case 'phone':
              case 'vendor contact':
              case 'contact':
                vendor.phone = value;
                break;
              case 'email':
              case 'vendor email':
                vendor.email = value;
                break;
              case 'address':
              case 'vendor address':
                vendor.address = value;
                break;
            }
          });

          // Enhanced validation with detailed error messages
          const requiredFields = [
            { field: 'name', label: 'Vendor Name' },
            { field: 'phone', label: 'Phone Number' },
            { field: 'email', label: 'Email Address' },
            { field: 'address', label: 'Address' }
          ];

          requiredFields.forEach(({ field, label }) => {
            if (!vendor[field]) {
              vendor.errors.push(`Missing ${label}`);
            }
          });

          // Validate email format
          if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
            vendor.errors.push('Invalid email format');
          }

          // Validate phone format (basic validation)
          if (vendor.phone && !/^[0-9+\-\s()]{10,}$/.test(vendor.phone)) {
            vendor.errors.push('Invalid phone format');
          }

          if (vendor.errors.length > 0) {
            vendor.status = 'error';
          }

          vendors.push(vendor);
        }

        setParsedVendors(vendors);
        setPage(0); // Reset pagination when new data is loaded
      } catch (err) {
        console.error('Error parsing CSV:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!selectedFile || parsedVendors.length === 0) return;

    const validVendors = parsedVendors.filter((v) => v.status === 'valid');
    onAction({
      file: selectedFile,
      vendors: validVendors,
      totalCount: parsedVendors.length,
      validCount: validVendors.length
    });
  };

  const downloadSampleFile = () => {
    const sampleCSV = `name,phone,email,address
John's Food Truck,0244651111,john@foodtruck.com,Accra Central
Tech Solutions Ltd,0244651112,info@techsolutions.com,East Legon
Ghana Catering Services,0244651113,catering@ghana.com,Tema Community 1
Fresh Produce Market,0244651114,fresh@produce.com,Kumasi Central Market`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_vendors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validVendors = parsedVendors.filter((v) => v.status === 'valid');
  const errorVendors = parsedVendors.filter((v) => v.status === 'error');

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Register bulk vendors into the TEMVO POS system.
      </Typography>

      <Alert icon={<InfoCircle size={20} variant="Bold" />} severity="info" sx={{ mb: 3 }}>
        Super Admins can bulk upload vendors via CSV.{' '}
        <Link component="button" onClick={downloadSampleFile} sx={{ textDecoration: 'underline' }}>
          Download a sample file
        </Link>{' '}
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
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv" style={{ display: 'none' }} disabled={loading} />
        <DocumentUpload size={48} variant="Bold" color="#2e7d32" style={{ marginBottom: 16 }} />
        <Typography variant="h6" gutterBottom>
          {selectedFile ? selectedFile.name : 'Choose a CSV file'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedFile ? 'Click to select a different file' : 'Click to browse or drag and drop your CSV file here'}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} disabled={loading}>
          Browse Files
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Processing vendors...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {parsedVendors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={<TickCircle size={16} variant="Bold" />}
              label={`${validVendors.length} Valid`}
              color="success"
              variant="outlined"
            />
            {errorVendors.length > 0 && (
              <Chip
                icon={<InfoCircle size={16} variant="Bold" />}
                label={`${errorVendors.length} Errors`}
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
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Errors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedVendors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vendor, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip size="small" label={vendor.status} color={vendor.status === 'valid' ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>
                      {vendor.errors.length > 0 && (
                        <Typography variant="caption" color="error">
                          {vendor.errors.join(', ')}
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
            count={parsedVendors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || validVendors.length === 0 || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Enrolling...' : `Enroll ${validVendors.length} Vendors`}
        </Button>
      </DialogActions>
    </Box>
  );
}
