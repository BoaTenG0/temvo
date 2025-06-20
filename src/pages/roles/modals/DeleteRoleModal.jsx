/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Typography, Button, Alert, CircularProgress, Box } from '@mui/material';
import { Warning2 } from 'iconsax-react';
import ReusableModal from 'components/modal/reusable';
import { useDeleteRole } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const DeleteRoleModal = ({ open, onClose, formData, refetchRoles }) => {
  const [error, setError] = useState('');
  const deleteRoleMutation = useDeleteRole(formData.id);

  const handleDelete = async () => {
    setError('');
    deleteRoleMutation.mutate(null, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Role deleted successfully!',
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
        setError(error.response?.data?.message || 'Failed to delete role. Please try again.');
        dispatch(
          openSnackbar({
            open: true,
            message: error.response?.data?.message || 'Failed to delete role. Please try again.',
            variant: 'alert',
            alert: {
              color: 'error'
            }
          })
        );
      }
    });
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined" disabled={deleteRoleMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleDelete}
        variant="contained"
        color="error"
        disabled={deleteRoleMutation.isPending}
        startIcon={deleteRoleMutation.isPending && <CircularProgress size={20} />}
      >
        {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete Role'}
      </Button>
    </>
  );

  return (
    <ReusableModal open={open} onClose={onClose} title="Delete Role" actions={actions} maxWidth={500}>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Warning2 sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Are you sure you want to delete this role?
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Role: <strong>{formData.name}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This action cannot be undone. All users assigned to this role will lose their permissions.
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

export default DeleteRoleModal;
