/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useBulkUploadWristbands } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const BulkWristbandModal = ({ open, onClose, selectedFile, onFileChange, refetchWristbands }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const bulkUploadMutation = useBulkUploadWristbands();

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };

      switch (name) {
        case 'file':
          if (!value) {
            errors.file = 'Please select a CSV file';
          } else if (!value.name.toLowerCase().endsWith('.csv')) {
            errors.file = 'Please select a valid CSV file';
          } else if (value.size > 5 * 1024 * 1024) {
            // 5MB limit
            errors.file = 'File size must be less than 5MB';
          } else {
            delete errors.file;
          }
          break;
        default:
          break;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validationErrors]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0] || null;

      // Clear any existing error
      if (error) setError('');

      // Validate the file
      validateField('file', file);

      // Update file selection
      onFileChange(file);
    },
    [error, onFileChange, validateField]
  );

  const handleDownloadSample = useCallback(() => {
    // Create sample CSV content for wristbands
    const sampleData = [
      ['model', 'modelNumber', 'serialNumber'],
      ['Fitbit Charge 5', 'FB-CH5-001', 'FB001234567890'],
      ['Apple Watch Series 8', 'AW-S8-002', 'AW002345678901'],
      ['Samsung Galaxy Watch', 'SGW-001', 'SGW003456789012'],
      ['Garmin Venu 2', 'GV2-001', 'GV2004567890123']
    ];

    // Convert to CSV string
    const csvContent = sampleData.map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'wristband_bulk_upload_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validate file before submission
    const isValid = validateField('file', selectedFile);

    if (!isValid) {
      setError('Please select a valid CSV file before submitting');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', selectedFile);

    bulkUploadMutation.mutate(formData, {
      onSuccess: (response) => {
        const successCount = response?.data?.successCount || 0;
        const errorCount = response?.data?.errorCount || 0;

        let message = 'Bulk upload completed successfully';
        if (successCount > 0 && errorCount > 0) {
          message = `Bulk upload completed: ${successCount} wristbands registered, ${errorCount} failed`;
        } else if (successCount > 0) {
          message = `${successCount} wristbands registered successfully`;
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

        refetchWristbands();
        // Close modal on success
        onClose();
      },
      onError: (err) => {
        setError(err?.response?.data?.message || err?.message || 'Failed to upload wristbands. Please try again.');
      }
    });
  }, [selectedFile, validateField, bulkUploadMutation, refetchWristbands, onClose]);

  const isFormValid = () => {
    return selectedFile && Object.keys(validationErrors).length === 0;
  };

  const isLoading = bulkUploadMutation.isPending;

  const renderContent = () => (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        Super Admins can bulk register wristbands via CSV. Download a sample file or choose a file to upload.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="outlined" color="primary" onClick={handleDownloadSample} disabled={isLoading} size="small">
          Download Sample CSV
        </Button>
      </Box>

      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          display: 'flex',
          overflow: 'hidden',
          mb: 2
        }}
      >
        <Button
          component="label"
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: 0,
            bgcolor: '#f5f5f5',
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#e0e0e0'
            }
          }}
        >
          Browse...
          <input type="file" hidden accept=".csv" onChange={handleFileChange} disabled={isLoading} />
        </Button>
        <Box sx={{ p: 2, flexGrow: 1 }}>{selectedFile ? selectedFile.name : 'No file selected.'}</Box>
      </Box>

      {validationErrors.file && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
          {validationErrors.file}
        </Typography>
      )}

      {selectedFile && (
        <Alert severity="success" sx={{ mb: 2 }}>
          File selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
        </Alert>
      )}
    </Box>
  );

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="upload"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!isFormValid() || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Uploading...' : 'Enroll Bulk Wristbands'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Register Bulk Wristbands"
      description="Register multiple wristbands in the TEMVO POS system."
      actions={actions}
      ariaLabelledBy="register-bulk-wristbands-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default BulkWristbandModal;
