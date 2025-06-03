import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useCreateWristband } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const NewWristbandModal = ({ open, onClose, formData, onFormChange, refetchWristbands }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const createWristbandMutation = useCreateWristband();

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };

      switch (name) {
        case 'modelName':
          if (!value.trim()) {
            errors.modelName = 'Model name is required';
          } else if (value.length < 2) {
            errors.modelName = 'Model name must be at least 2 characters';
          } else {
            delete errors.modelName;
          }
          break;
        case 'modelNumber':
          if (!value.trim()) {
            errors.modelNumber = 'Model number is required';
          } else if (!/^[A-Z0-9-]+$/i.test(value)) {
            errors.modelNumber = 'Model number can only contain letters, numbers, and hyphens';
          } else {
            delete errors.modelNumber;
          }
          break;
        case 'serialNumber':
          if (!value.trim()) {
            errors.serialNumber = 'Serial number is required';
          } else if (value.length < 4) {
            errors.serialNumber = 'Serial number must be at least 4 characters';
          } else {
            delete errors.serialNumber;
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

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Clear any existing error for this field
      if (error) setError('');

      // Validate the field
      validateField(name, value);

      // Update form data
      onFormChange({ [name]: value });
    },
    [error, onFormChange, validateField]
  );

  const handleSubmit = useCallback(async () => {
    // Validate all fields before submission
    const isValid = ['modelName', 'modelNumber', 'serialNumber'].every((field) => validateField(field, formData[field] || ''));

    if (!isValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    const wristbandData = {
      model: formData.modelName.trim(),
      modelNumber: formData.modelNumber.trim().toUpperCase(),
      serialNumber: formData.serialNumber.trim()
    };

    createWristbandMutation.mutate(wristbandData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Wristband created successfully',
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
        setError(err.message || 'Failed to register wristband. Please try again.');
      }
    });
  }, [formData, validateField, createWristbandMutation, onClose]);

  const isFormValid = () => {
    return (
      formData.modelName?.trim() &&
      formData.modelNumber?.trim() &&
      formData.serialNumber?.trim() &&
      Object.keys(validationErrors).length === 0
    );
  };

  const isLoading = createWristbandMutation.isLoading;

  const renderContent = () => (
    <Grid container spacing={3}>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Model Name *
        </Typography>
        <TextField
          fullWidth
          name="modelName"
          placeholder="Enter Model Name"
          value={formData.modelName || ''}
          onChange={handleInputChange}
          error={!!validationErrors.modelName}
          helperText={validationErrors.modelName}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Model Number *
        </Typography>
        <TextField
          fullWidth
          name="modelNumber"
          placeholder="Enter Model Number (e.g., WB-2024-001)"
          value={formData.modelNumber || ''}
          onChange={handleInputChange}
          error={!!validationErrors.modelNumber}
          helperText={validationErrors.modelNumber}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Serial Number *
        </Typography>
        <TextField
          fullWidth
          name="serialNumber"
          placeholder="Enter Serial Number"
          value={formData.serialNumber || ''}
          onChange={handleInputChange}
          error={!!validationErrors.serialNumber}
          helperText={validationErrors.serialNumber}
          disabled={isLoading}
        />
      </Grid>
    </Grid>
  );

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="register"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!isFormValid() || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Registering...' : 'Register Wristband'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Register New Wristband"
      description="Register a new wristband in the TEMVO POS system."
      actions={actions}
      ariaLabelledBy="register-new-wristband-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default NewWristbandModal;
