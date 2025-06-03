import React from 'react';
import { Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDeactivateWristband } from 'api/requests';

const DeactivateWristbandModal = ({ open, onClose, state, refetchWristbands }) => {
  const deactivateWristbandMutation = useDeactivateWristband(state?.deactivateId);

  const handleDeactivateWristband = () => {
    deactivateWristbandMutation.mutate(null, {
      onSuccess: () => {
        refetchWristbands();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `Wristband deactivated successfully`,
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
            message: err.message || 'Failed to deactivate wristband. Please try again.',
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

  const isLoading = deactivateWristbandMutation.isPending;

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose}>
      Cancel
    </Button>,
    <Button key="delete" variant="contained" color="primary" onClick={handleDeactivateWristband}>
      {isLoading ? 'Deactivating...' : 'Yes Deactivate'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Deactivate Wristband"
      description="Are you sure you want to deactivate this wristband?"
      actions={actions}
      ariaLabelledBy="deactivate-wristband-modal"
    />
  );
};

export default DeactivateWristbandModal;
