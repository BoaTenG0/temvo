import React from 'react';
import {
  Box,
  Typography,
  Button,
  Modal
} from '@mui/material';
import { modalStyle } from '../../constants/posConstants';

const DeletePosModal = ({
  open,
  onClose,
  onConfirm
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="deactivate-pos-modal">
      <Box sx={modalStyle}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Are you sure you want to deactivate this POS?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeletePosModal;
