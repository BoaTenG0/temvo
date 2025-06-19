import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';

const WalletActionModal = ({ open, onClose, isActivation, onConfirm, loading, walletId,  }) => {
  console.log("🚀 ~ WalletActionModal ~ walletId:", walletId)
  const actionText = isActivation ? 'activate' : 'deactivate';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isActivation ? 'Activate Wallet' : 'Deactivate Wallet'}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to {actionText} this wallet (ID: {walletId})?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={isActivation ? 'success' : 'warning'}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? `${actionText === 'activate' ? 'Activating' : 'Deactivating'}...` : `${actionText}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WalletActionModal;
