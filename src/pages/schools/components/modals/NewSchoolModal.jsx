/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useCreateGeneralSchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const NewSchoolModal = ({ open, onClose, formData, onFormChange, refetchSchools }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const createSchoolMutation = useCreateGeneralSchool();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone validation regex (Ghana format)
  const phoneRegex = /^(\+233|0)[0-9]{9}$/;

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };

      switch (name) {
        case 'schoolName':
          if (!value.trim()) {
            errors.schoolName = 'School name is required';
          } else if (value.length < 3) {
            errors.schoolName = 'School name must be at least 3 characters';
          } else {
            delete errors.schoolName;
          }
          break;
        case 'schoolNumber':
          if (!value.trim()) {
            errors.schoolNumber = 'School ID is required';
          } else if (value.length < 2) {
            errors.schoolNumber = 'School ID must be at least 2 characters';
          } else {
            delete errors.schoolNumber;
          }
          break;
        case 'schoolRegion':
          if (!value.trim()) {
            errors.schoolRegion = 'Region is required';
          } else if (value.length < 2) {
            errors.schoolRegion = 'Region must be at least 2 characters';
          } else {
            delete errors.schoolRegion;
          }
          break;
        case 'adminName':
          if (!value.trim()) {
            errors.adminName = 'Admin name is required';
          } else if (value.length < 2) {
            errors.adminName = 'Admin name must be at least 2 characters';
          } else {
            delete errors.adminName;
          }
          break;
        case 'adminNumber':
          if (!value.trim()) {
            errors.adminNumber = 'Admin phone is required';
          } else if (!phoneRegex.test(value.trim())) {
            errors.adminNumber = 'Please enter a valid phone number (e.g., 0595833503 or +233595833503)';
          } else {
            delete errors.adminNumber;
          }
          break;
        case 'adminEmail':
          if (!value.trim()) {
            errors.adminEmail = 'Admin email is required';
          } else if (!emailRegex.test(value.trim())) {
            errors.adminEmail = 'Please enter a valid email address';
          } else {
            delete errors.adminEmail;
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
    const requiredFields = ['schoolName', 'schoolNumber', 'schoolRegion', 'adminName', 'adminNumber', 'adminEmail'];
    const isValid = requiredFields.every((field) => validateField(field, formData[field] || ''));

    if (!isValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    // Map form data to API payload format
    const schoolData = {
      name: formData.schoolName.trim(),
      code: formData.schoolNumber.trim(),
      address: formData.schoolRegion.trim(),
      adminName: formData.adminName.trim(),
      adminEmail: formData.adminEmail.trim(),
      adminPhone: formData.adminNumber.trim()
    };

    createSchoolMutation.mutate(schoolData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'School registered successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchSchools();
        // Close modal on success
        onClose();
      },
      onError: (err) => {
        setError(err?.response?.data?.message || err?.message || 'Failed to register school. Please try again.');
      }
    });
  }, [formData, validateField, createSchoolMutation, refetchSchools, onClose]);

  const isFormValid = () => {
    const requiredFields = ['schoolName', 'schoolNumber', 'schoolRegion', 'adminName', 'adminNumber', 'adminEmail'];
    return requiredFields.every((field) => formData[field]?.trim()) && Object.keys(validationErrors).length === 0;
  };

  const isLoading = createSchoolMutation.isPending;

  const renderContent = () => (
    <Grid container spacing={3}>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          School Name *
        </Typography>
        <TextField
          fullWidth
          name="schoolName"
          placeholder="Enter School Name"
          value={formData.schoolName || ''}
          onChange={handleInputChange}
          error={!!validationErrors.schoolName}
          helperText={validationErrors.schoolName}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          School Code *
        </Typography>
        <TextField
          fullWidth
          name="schoolNumber"
          placeholder="Specify School Code"
          value={formData.schoolNumber || ''}
          onChange={handleInputChange}
          error={!!validationErrors.schoolNumber}
          helperText={validationErrors.schoolNumber}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Address *
        </Typography>
        <TextField
          fullWidth
          name="schoolRegion"
          placeholder="Enter School's Address"
          value={formData.schoolRegion || ''}
          onChange={handleInputChange}
          error={!!validationErrors.schoolRegion}
          helperText={validationErrors.schoolRegion}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Admin Name *
        </Typography>
        <TextField
          fullWidth
          name="adminName"
          placeholder="Enter School's Admin Name"
          value={formData.adminName || ''}
          onChange={handleInputChange}
          error={!!validationErrors.adminName}
          helperText={validationErrors.adminName}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Admin Phone *
        </Typography>
        <TextField
          fullWidth
          name="adminNumber"
          placeholder="Enter Admin's Phone (e.g., 0595833503)"
          value={formData.adminNumber || ''}
          onChange={handleInputChange}
          error={!!validationErrors.adminNumber}
          helperText={validationErrors.adminNumber}
          disabled={isLoading}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Admin Email *
        </Typography>
        <TextField
          fullWidth
          name="adminEmail"
          placeholder="Enter Admin's Email"
          value={formData.adminEmail || ''}
          onChange={handleInputChange}
          error={!!validationErrors.adminEmail}
          helperText={validationErrors.adminEmail}
          disabled={isLoading}
          type="email"
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
      {isLoading ? 'Registering...' : 'Register School'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Register New School"
      description="Register a new school in the TEMVO system."
      actions={actions}
      ariaLabelledBy="register-new-school-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default NewSchoolModal;
