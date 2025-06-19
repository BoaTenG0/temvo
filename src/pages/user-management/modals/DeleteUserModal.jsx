import React, { useState, useCallback } from 'react';
import { Typography, Button, Alert, CircularProgress } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useDeleteUser } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const DeleteUserModal = ({ open, onClose, userData, refetchUsers }) => {
  const [error, setError] = useState('');
  const deleteUserMutation = useDeleteUser(userData?.id);

  const handleSubmit = useCallback(async () => {
    if (!userData?.id) {
      setError('User data is not available');
      return;
    }

    deleteUserMutation.mutate(null, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'User deleted successfully',
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
        setError(err.message || 'Failed to delete user. Please try again.');
      }
    });
  }, [userData, deleteUserMutation, onClose, refetchUsers]);

  const isLoading = deleteUserMutation.isPending;

  const renderContent = () => (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete user <strong>{userData?.userName}</strong>? This action cannot be undone.
      </Typography>
    </>
  );

  const actions = [
    <Button key="cancel" variant="outlined" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="delete"
      variant="contained"
      color="error"
      onClick={handleSubmit}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Deleting...' : 'Delete User'}
    </Button>
  ];

  return (
    <ReusableModal open={open} onClose={onClose} title="Delete User" description="" actions={actions} ariaLabelledBy="delete-user-modal">
      {renderContent()}
    </ReusableModal>
  );
};

export default DeleteUserModal;
