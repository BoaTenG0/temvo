/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { AssignPOSContent } from './assignPOSContent';
import { AddVendorContent } from './addVendorContext';
import { BulkVendorsContent } from './bulkVendorsContent';

const modalConfig = {
  assign: {
    title: 'Assign POS',
    maxWidth: 'md'
  },
  add: {
    title: 'Register New Vendor',
    maxWidth: 'sm'
  },
  edit: {
    title: 'Edit Vendor',
    maxWidth: 'sm'
  },
  bulk: {
    title: 'Register Bulk Vendors',
    maxWidth: 'md'
  },
  delete: {
    title: 'Delete Vendor',
    maxWidth: 'sm'
  }
};

export function VendorActionModal({ open, type, loading, selectedVendors, editData, onClose, onAction, vendors, onVendorLoading }) {
  if (!type) return null;

  const config = modalConfig[type];

  const renderContent = () => {
    switch (type) {
      case 'assign':
        return (
          <AssignPOSContent vendors={vendors} selectedVendors={selectedVendors} onAction={onAction} loading={loading} onClose={onClose} />
        );
      case 'add':
      case 'edit':
        return (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {type === 'edit' ? 'Update vendor information.' : 'Register a new vendor in the TEMVO POS system.'}
            </Typography>
            <AddVendorContent onAction={onAction} loading={onVendorLoading} onClose={onClose} initialData={editData} mode={type} />
          </>
        );
      case 'bulk':
        return <BulkVendorsContent onAction={onAction} loading={loading} onClose={onClose} />;
      case 'delete':
        return (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete vendor &ldquo;{editData?.name}&rdquo;? This action cannot be undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={() => onAction()} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Vendor'}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={config.maxWidth}
      fullWidth
      aria-labelledby="modal-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 300
        }
      }}
    >
      <DialogTitle
        id="modal-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        {config.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseCircle size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>{renderContent()}</DialogContent>
    </Dialog>
  );
}

// PropTypes
VendorActionModal.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.oneOf(['assign', 'add', 'edit', 'bulk', 'delete']),
  loading: PropTypes.bool,
  selectedVendors: PropTypes.array,
  editData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
  }),
  onClose: PropTypes.func,
  onAction: PropTypes.func,
  vendors: PropTypes.array,
  onVendorLoading: PropTypes.bool
};
