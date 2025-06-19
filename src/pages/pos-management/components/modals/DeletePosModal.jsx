/* eslint-disable no-unused-vars */

import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { modalStyle } from '../../constants/posConstants';
import { useDeletePOSDevice } from 'api/requests';
import ReusableModal from 'components/modal/reusable';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';

const DeletePosModal = ({ open, onClose, onConfirm, refetchPos, state }) => {
  const deletePOSDevice = useDeletePOSDevice(state?.deleteId);

  const handleDeleteWristband = () => {
    deletePOSDevice.mutate(null, {
      onSuccess: (data) => {
        // onClose();
        dispatch(
          openSnackbar({
            open: true,
            message: `POS Device deleted successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchPos();
        onClose();
      },
      onError: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to delete pos device. Please try again.',
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

  const isLoading = deletePOSDevice.isPending;

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
      title="Deleted POS Device"
      description="Are you sure you want to delete this pos device?"
      actions={actions}
      ariaLabelledBy="delete-posdevice-modal"
    />
  );
};

export default DeletePosModal;
