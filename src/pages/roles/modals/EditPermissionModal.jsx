/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, Button, Alert, CircularProgress, FormControlLabel, Switch, Autocomplete } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useUpdatePermission } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { validatePermissionForm, PERMISSION_ACTIONS, PERMISSION_RESOURCES } from '../util';

const EditPermissionModal = ({ open, onClose, formData, onFormChange, refetchPermissions }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const updatePermissionMutation = useUpdatePermission(formData.id);

  const handleInputChange = useCallback(
    (field, value) => {
      onFormChange('editPermission', field, value);
      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [onFormChange, validationErrors]
  );

  const handleSubmit = async () => {
    try {
      setError('');
      setValidationErrors({});

      // Validate form
      const errors = validatePermissionForm(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        resource: formData.resource.trim(),
        action: formData.action.trim(),
        active: formData.active
      };

      await updatePermissionMutation.mutateAsync(submitData);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Permission updated successfully!',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );

      refetchPermissions();
      onClose();
    } catch (error) {
      console.error('Error updating permission:', error);
      setError(error.response?.data?.message || 'Failed to update permission. Please try again.');
    }
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined" disabled={updatePermissionMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={updatePermissionMutation.isPending}
        startIcon={updatePermissionMutation.isPending && <CircularProgress size={20} />}
      >
        {updatePermissionMutation.isPending ? 'Updating...' : 'Update Permission'}
      </Button>
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Edit Permission"
      description="Update permission information."
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
            label="Permission Name"
            placeholder="Enter permission name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            options={PERMISSION_RESOURCES}
            value={formData.resource || null}
            onChange={(event, newValue) => handleInputChange('resource', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Resource"
                placeholder="Search or select resource..."
                required
                error={!!validationErrors.resource}
                helperText={validationErrors.resource}
              />
            )}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            options={PERMISSION_ACTIONS}
            value={formData.action || null}
            onChange={(event, newValue) => handleInputChange('action', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Action"
                placeholder="Search or select action..."
                required
                error={!!validationErrors.action}
                helperText={validationErrors.action}
              />
            )}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter permission description (optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!validationErrors.description}
            helperText={validationErrors.description}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={formData.active} onChange={(e) => handleInputChange('active', e.target.checked)} color="primary" />}
            label="Active"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            Inactive permissions cannot be assigned to roles
          </Typography>
        </Grid>
      </Grid>
    </ReusableModal>
  );
};

export default EditPermissionModal;
