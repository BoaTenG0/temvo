import React from 'react';
import { Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDeactivatePOS } from 'api/requests';

const DeactivatePOSModal = ({ open, onClose, state, refetchWristbands }) => {
  const deactivateWristbandMutation = useDeactivatePOS(state?.deactivateId);

  const handleDeactivateWristband = () => {
    deactivateWristbandMutation.mutate(null, {
      onSuccess: () => {
        refetchWristbands();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `POS deactivated successfully`,
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
            message: err.message || 'Failed to deactivate POS device. Please try again.',
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
      title="Deactivate POS Device"
      description="Are you sure you want to deactivate this pos device?"
      actions={actions}
      ariaLabelledBy="deactivate-posdevice-modal"
    />
  );
};

export default DeactivatePOSModal;
