/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Autocomplete
} from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useCreateRole } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { validateRoleForm, formatPermissionName } from '../util';

const NewRoleModal = ({ open, onClose, formData, onFormChange, refetchRoles, permissions = [] }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const createRoleMutation = useCreateRole();

  const handleInputChange = useCallback(
    (field, value) => {
      onFormChange('newRole', field, value);
      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [onFormChange, validationErrors]
  );

  //   const handlePermissionChange = (event, newValue) => {
  //     const selectedPermissionIds = newValue.map((permission) => permission.id);
  //     handleInputChange('permissions', selectedPermissionIds);
  //   };
  const handlePermissionChange = (event, newValue) => {
    const selectedPermissionUris = newValue.map((permission) => `/permissions/${permission.id}`);
    handleInputChange('permissions', selectedPermissionUris);
  };

  const handleSubmit = async () => {
    setError('');
    setValidationErrors({});

    // Validate form
    const errors = validateRoleForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      permissions: formData.permissions || []
      // active: formData.active
    };

    createRoleMutation.mutate(submitData, {
      onSuccess: (response) => {
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Role created successfully!',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          })
        );

        refetchRoles();
        onClose();
      },
      onError: (error) => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Creating role unsuccessful!',
            variant: 'alert',
            alert: {
              color: 'error'
            }
          })
        );
        setError(error.response?.data?.message || 'Failed to create role. Please try again.');
      }
    });
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined" disabled={createRoleMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={createRoleMutation.isPending}
        startIcon={createRoleMutation.isPending && <CircularProgress size={20} />}
      >
        {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
      </Button>
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Create New Role"
      description="Create a new role and assign permissions to it."
      actions={actions}
      maxWidth={600}
    >
      <Grid container spacing={3}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Role Name"
            placeholder="Enter role name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter role description (optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!validationErrors.description}
            helperText={validationErrors.description}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            fullWidth
            options={permissions}
            // value={permissions.filter((p) => formData.permissions?.includes(p.id)) || []}
            value={permissions.filter((p) => formData.permissions?.includes(`/permissions/${p.id}`)) || []}
            onChange={handlePermissionChange}
            getOptionLabel={(option) => formatPermissionName(option.name)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Permissions"
                placeholder="Search and select permissions..."
                error={!!validationErrors.permissions}
                helperText={validationErrors.permissions}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPermissionName(option.name)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.resource} - {option.action}
                  </Typography>
                </Box>
              </Box>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option.id}
                  label={formatPermissionName(option.name)}
                  size="small"
                  {...getTagProps({ index })}
                  sx={{
                    bgcolor: 'primary.lighter',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }
                  }}
                />
              ))
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                p: 1
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={formData.active} onChange={(e) => handleInputChange('active', e.target.checked)} color="primary" />}
            label="Active"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            Inactive roles cannot be assigned to users
          </Typography>
        </Grid>
      </Grid>
    </ReusableModal>
  );
};

export default NewRoleModal;
