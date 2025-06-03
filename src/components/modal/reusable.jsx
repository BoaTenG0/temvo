import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { CloseCircle } from 'iconsax-react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const ReusableModal = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  maxWidth = 600,
  showCloseButton = true,
  ariaLabelledBy
}) => {
  const customModalStyle = {
    ...modalStyle,
    width: maxWidth
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby={ariaLabelledBy || 'modal-title'}>
      <Box sx={customModalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h6" component="h2" id="modal-title">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton onClick={onClose} size="small">
              <CloseCircle fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Description */}
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ mb: actions ? 4 : 0 }}>{children}</Box>

        {/* Actions */}
        {actions && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ReusableModal;
