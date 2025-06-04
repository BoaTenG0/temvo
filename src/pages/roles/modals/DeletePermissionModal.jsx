/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useDeletePermission } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { Warning2 } from "iconsax-react";

const DeletePermissionModal = ({ open, onClose, formData, refetchPermissions }) => {
  const [error, setError] = useState('');
  const deletePermissionMutation = useDeletePermission(formData.id);

  const handleDelete = async () => {
    try {
      setError('');
      await deletePermissionMutation.mutateAsync();

      dispatch(
        openSnackbar({
          open: true,
          message: 'Permission deleted successfully!',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );

      refetchPermissions();
      onClose();
    } catch (error) {
      console.error('Error deleting permission:', error);
      setError(error.response?.data?.message || 'Failed to delete permission. Please try again.');
    }
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined" disabled={deletePermissionMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleDelete}
        variant="contained"
        color="error"
        disabled={deletePermissionMutation.isPending}
        startIcon={deletePermissionMutation.isPending && <CircularProgress size={20} />}
      >
        {deletePermissionMutation.isPending ? 'Deleting...' : 'Delete Permission'}
      </Button>
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Delete Permission"
      actions={actions}
      maxWidth={500}
    >
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Warning2 sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Are you sure you want to delete this permission?
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Permission: <strong>{formData.name}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This action cannot be undone. All roles with this permission will lose access to the associated functionality.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </ReusableModal>
  );
};

export default DeletePermissionModal;
