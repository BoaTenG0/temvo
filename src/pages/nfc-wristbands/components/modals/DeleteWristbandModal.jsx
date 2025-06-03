import React from 'react';
import { Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useDeleteWristband } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const DeleteWristbandModal = ({ open, onClose, state, refetchWristbands }) => {
  const deleteWristbandMutation = useDeleteWristband(state?.deleteId);

  const handleDeleteWristband = () => {
    deleteWristbandMutation.mutate(null, {
      onSuccess: () => {
        refetchWristbands();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `Wristband deleted successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        onClose();
      },
      onError: (err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err.message || 'Failed to delete wristband. Please try again.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    });
  };

  const isLoading = deleteWristbandMutation.isPending;

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose}>
      Cancel
    </Button>,
    <Button key="delete" variant="contained" color="primary" onClick={handleDeleteWristband}>
      {isLoading ? 'Deleting...' : 'Yes Delete'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Deleted Wristband"
      description="Are you sure you want to delete this wristband?"
      actions={actions}
      ariaLabelledBy="delete-wristband-modal"
    />
  );
};

export default DeleteWristbandModal;
