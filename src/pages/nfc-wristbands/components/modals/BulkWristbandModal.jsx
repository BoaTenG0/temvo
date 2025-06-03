import React from 'react';
import { Box, Alert, Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';

const BulkWristbandModal = ({
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

  const renderContent = () => (
    <>
      <Alert severity="info" sx={{ mb: 3 }}>
        Super Admins can bulk wristbands schools via CSV. Download a{' '}
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
    </>
  );

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose}>
      Cancel
    </Button>,
    <Button 
      key="enroll" 
      variant="contained" 
      color="primary" 
      onClick={onSubmit} 
      disabled={!selectedFile}
    >
      Enroll Bulk Wristbands
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Register Bulk Wristbands"
      description="Register multiple Wristbands in the TEMVO POS system."
      actions={actions}
      ariaLabelledBy="register-bulk-wristbands-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default BulkWristbandModal;
