import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, CircularProgress, MenuItem } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useEditUser } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const EditUserModal = ({ open, onClose, formData, onFormChange, refetchUsers }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const updateUserMutation = useEditUser();

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };
      switch (name) {
        case 'userName':
          if (!value.trim()) {
            errors.userName = 'User name is required';
          } else if (value.length < 2) {
            errors.userName = 'User name must be at least 2 characters';
          } else {
            delete errors.userName;
          }
          break;
        case 'email':
          if (!value.trim()) {
            errors.email = 'Email is required';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            errors.email = 'Please enter a valid email address';
          } else {
            delete errors.email;
          }
          break;
        case 'phoneNumber':
          if (value && value.length < 10) {
            errors.phoneNumber = 'Phone number must be at least 10 digits';
          } else {
            delete errors.phoneNumber;
          }
          break;
        case 'role':
          if (!value) {
            errors.role = 'Role is required';
          } else {
            delete errors.role;
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
    // Validate all required fields before submission
    const isValid = ['userName', 'email', 'role'].every((field) => validateField(field, formData[field] || ''));

    if (!isValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    const userData = {
      id: formData.id,
      userName: formData.userName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber?.trim() || '',
      role: formData.role,
      assignedSchool: formData.assignedSchool?.trim() || ''
    };

    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'User updated successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchUsers();
        onClose();
      },
      onError: (err) => {
        setError(err.message || 'Failed to update user. Please try again.');
      }
    });
  }, [formData, validateField, updateUserMutation, onClose, refetchUsers]);

  const isFormValid = () => {
    return formData.userName?.trim() && formData.email?.trim() && formData.role && Object.keys(validationErrors).length === 0;
  };

  const isLoading = updateUserMutation.isPending;

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
          User Name *
        </Typography>
        <TextField
          fullWidth
          name="userName"
          placeholder="Enter User Name"
          value={formData.userName || ''}
          onChange={handleInputChange}
          error={!!validationErrors.userName}
          helperText={validationErrors.userName}
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Email *
        </Typography>
        <TextField
          fullWidth
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email || ''}
          onChange={handleInputChange}
          error={!!validationErrors.email}
          helperText={validationErrors.email}
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Phone Number
        </Typography>
        <TextField
          fullWidth
          name="phoneNumber"
          placeholder="Enter Phone Number"
          value={formData.phoneNumber || ''}
          onChange={handleInputChange}
          error={!!validationErrors.phoneNumber}
          helperText={validationErrors.phoneNumber}
          disabled={isLoading}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Role *
        </Typography>
        <TextField
          select
          fullWidth
          name="role"
          value={formData.role || ''}
          onChange={handleInputChange}
          error={!!validationErrors.role}
          helperText={validationErrors.role}
          disabled={isLoading}
        >
          <MenuItem value="Super Admin">Super Admin</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Teacher">Teacher</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Assigned School
        </Typography>
        <TextField
          fullWidth
          name="assignedSchool"
          placeholder="Enter Assigned School"
          value={formData.assignedSchool || ''}
          onChange={handleInputChange}
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
      key="update"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!isFormValid() || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Updating...' : 'Update User'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Edit User"
      description="Update user information."
      actions={actions}
      ariaLabelledBy="edit-user-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default EditUserModal;
