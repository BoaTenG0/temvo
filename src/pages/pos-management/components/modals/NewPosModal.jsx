/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Box, Grid, Typography, TextField, Button, Modal, IconButton } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/posConstants';
import { useCreatePOS } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const NewPosModal = ({ open, onClose, formData, onFormChange, onSubmit, refetchPOS }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const createPosMutation = useCreatePOS();

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

    const posData = {
      model: formData.modelName.trim(),
      modelNumber: formData.modelNumber.trim().toUpperCase(),
      serialNumber: formData.serialNumber.trim()
    };

    createPosMutation.mutate(posData, {
      onSuccess: (response) => {
        onClose();
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'POS created successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchPOS();
      },
      onError: (err) => {
        setError(err.message || 'Failed to register POS. Please try again.');
      }
    });
    // onClose();
  }, [formData, validateField, createPosMutation, onClose]);

  const isFormValid = () => {
    return (
      formData.modelName?.trim() &&
      formData.modelNumber?.trim() &&
      formData.serialNumber?.trim() &&
      Object.keys(validationErrors).length === 0
    );
  };

  const isLoading = createPosMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="register-new-pos-modal">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Register New POS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Register a new POS in the TEMVO POS system.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Model Name
            </Typography>
            <TextField fullWidth name="modelName" placeholder="Enter Model Name" value={formData.modelName} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Model Number
            </Typography>
            <TextField
              fullWidth
              name="modelNumber"
              placeholder="Enter Model Number"
              value={formData.modelNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Serial Number
            </Typography>
            <TextField
              fullWidth
              name="serialNumber"
              placeholder="Enter Serial Number"
              value={formData.serialNumber}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!isFormValid() || isLoading}>
            {isLoading ? 'Registering' : 'Register POS'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewPosModal;
