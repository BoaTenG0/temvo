import React from 'react';
import { Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useActivatePOS } from 'api/requests';

const ActivatePOSModal = ({ open, onClose, state, refetchWristbands }) => {
  const deactivateWristbandMutation = useActivatePOS(state?.activateId);

  const handleDeactivateWristband = () => {
    deactivateWristbandMutation.mutate(null, {
      onSuccess: () => {
        refetchWristbands();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `POS Device activated successfully`,
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
            message: err.message || 'Failed to activate device. Please try again.',
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
      {isLoading ? 'Activating...' : 'Yes Activate'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Activate POS Device"
      description="Are you sure you want to activate this device?"
      actions={actions}
      ariaLabelledBy="activate-posdevice-modal"
    />
  );
};

export default ActivatePOSModal;
