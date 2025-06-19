/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, CircularProgress, MenuItem, Checkbox } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useCreateUser } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const NewUserModal = ({ open, onClose, formData, onFormChange, refetchUsers, roles, schools }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const createUserMutation = useCreateUser();

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };
      switch (name) {
        case 'firstName':
          if (!value.trim()) {
            errors.firstName = 'User name is required';
          } else if (value.length < 2) {
            errors.firstName = 'User name must be at least 2 characters';
          } else {
            delete errors.firstName;
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
        case 'phone':
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
    const isValid = ['firstName', 'email', 'role'].every((field) => validateField(field, formData[field] || ''));

    if (!isValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName?.trim() || '',
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || '',
      roles: [`/roles/${formData.role}`],
      //   roles: ['/roles/1'],
      userType: formData.userType,
      password: formData.password?.trim() || '',
      active: formData.active,
      isPhoneVerified: true,
      isEmailVerified: true,
      isFirstTimeLogin: true
      //   assignedSchool: formData.assignedSchool.toString()
    };

    createUserMutation.mutate(userData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'User created successfully',
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
        setError(err.message || 'Failed to create user. Please try again.');
      }
    });
  }, [formData, validateField, createUserMutation, onClose, refetchUsers]);

  const isFormValid = () => {
    return formData.firstName?.trim() && formData.email?.trim() && formData.role && Object.keys(validationErrors).length === 0;
  };

  const isLoading = createUserMutation.isPending;

  const renderContent = () => (
    <Grid container spacing={2}>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          First Name *
        </Typography>
        <TextField
          fullWidth
          name="firstName"
          placeholder="Enter first name"
          value={formData.firstName || ''}
          onChange={handleInputChange}
          error={!!validationErrors.firstName}
          helperText={validationErrors.firstName}
          disabled={isLoading}
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Last Name
        </Typography>
        <TextField
          fullWidth
          name="lastName"
          placeholder="Enter last name"
          value={formData.lastName || ''}
          onChange={handleInputChange}
          disabled={isLoading}
          size="small"
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
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Phone Number
        </Typography>
        <TextField
          fullWidth
          name="phone"
          placeholder="Enter Phone Number"
          value={formData.phone || ''}
          onChange={handleInputChange}
          error={!!validationErrors.phone}
          helperText={validationErrors.phone}
          disabled={isLoading}
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Password *
        </Typography>
        <TextField
          fullWidth
          name="password"
          placeholder="Enter temporal Password"
          value={formData.password || ''}
          onChange={handleInputChange}
          error={!!validationErrors.password}
          helperText={validationErrors.password}
          disabled={isLoading}
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          User Type *
        </Typography>
        <TextField
          select
          fullWidth
          name="userType"
          value={formData.userType || ''}
          onChange={handleInputChange}
          error={!!validationErrors.userType}
          helperText={validationErrors.userType}
          disabled={isLoading}
          size="small"
        >
          <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          <MenuItem value="SCHOOL_ADMIN">School Admin</MenuItem>
          <MenuItem value="PARENT">Parent</MenuItem>
          <MenuItem value="VENDOR">Vendor</MenuItem>
        </TextField>
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
          size="small"
        >
          {roles?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {/* <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Assigned School
        </Typography>
        <TextField
          fullWidth
          name="assignedSchool"
          placeholder="Select a school"
          value={formData.assignedSchool || ''}
          onChange={handleInputChange}
          disabled={isLoading}
          select
          error={!!validationErrors.assignedSchool}
          helperText={validationErrors.assignedSchool}
          size="small"
        >
          {schools
            ?.filter((option) => option.name !== 'All')
            .map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>
      </Grid> */}
      <Grid item xs={6}>
        <Typography variant="subtitle2" gutterBottom>
          Active
        </Typography>
        <Checkbox checked={formData.active} onChange={(e) => onFormChange({ active: e.target.checked })} disabled={isLoading} />
      </Grid>
    </Grid>
  );

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="create"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!isFormValid() || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Creating...' : 'Add User'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Add New User"
      description="Add a new user to the TEMVO system."
      actions={actions}
      ariaLabelledBy="new-user-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default NewUserModal;
