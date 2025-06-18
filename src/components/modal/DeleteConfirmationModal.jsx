import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, message, isDeleting }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <Typography>{message || 'Are you sure you want to delete? This action cannot be undone.'}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  isDeleting: PropTypes.bool
};

DeleteConfirmationModal.defaultProps = {
  title: 'Confirm Delete',
  message: 'Are you sure you want to delete? This action cannot be undone.',
  isDeleting: false
};

export default DeleteConfirmationModal;
