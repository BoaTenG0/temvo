import React from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  IconButton,
  Alert
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/posConstants';

const BulkPosModal = ({
  open,
  onClose,
  selectedFile,
  onFileChange,
  onSubmit
}) => {
  const handleFileChange = (e) => {
    if (e.target.files) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="register-bulk-pos-modal">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Register Bulk POS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Register multiple POS in the TEMVO POS system.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Super Admins can bulk POS via CSV. Download a{' '}
          <Button variant="text" color="primary" size="small" sx={{ p: 0, minWidth: 'auto', fontWeight: 'bold' }}>
            sample file
          </Button>{' '}
          or choose a file to upload.
        </Alert>

        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            display: 'flex',
            overflow: 'hidden',
            mb: 2
          }}
        >
          <Button
            component="label"
            variant="contained"
            sx={{
              borderRadius: 0,
              bgcolor: '#f5f5f5',
              color: 'text.primary',
              '&:hover': {
                bgcolor: '#e0e0e0'
              }
            }}
          >
            Browse...
            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
          </Button>
          <Box sx={{ p: 2, flexGrow: 1 }}>
            {selectedFile ? selectedFile.name : 'No file selected.'}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onSubmit} 
            disabled={!selectedFile}
          >
            Enroll Bulk POS Devices
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BulkPosModal;
