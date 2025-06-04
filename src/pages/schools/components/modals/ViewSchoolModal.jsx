import React from 'react';
import { Modal, Box, Typography, IconButton, Grid, TextField } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/schoolConstants';

const ViewSchoolModal = ({ open, onClose, schoolData }) => {
  console.log('🚀 ~ ViewSchoolModal ~ schoolData:', schoolData);
  if (!schoolData) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="view-school-details">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            View School Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              School Name
            </Typography>
            <TextField fullWidth placeholder="School Name" disabled value={schoolData.name || ''} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              School Code
            </Typography>
            <TextField fullWidth placeholder="School COde" disabled value={schoolData.code || ''} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              School Address
            </Typography>
            <TextField fullWidth placeholder="School Address" disabled value={schoolData.address || ''} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Name
            </Typography>
            <TextField fullWidth placeholder="Admin Name" disabled value={schoolData.adminName || 'N/A'} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Number
            </Typography>
            <TextField fullWidth placeholder="Admin Number" disabled value={schoolData.adminPhone || 'N/A'} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Email
            </Typography>
            <TextField fullWidth placeholder="Admin Email" disabled value={schoolData.adminEmail || 'N/A'} />
          </Grid>
          {/* <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              No. of POS
            </Typography>
            <TextField fullWidth placeholder="Number of POS Devices" disabled value={schoolData.pos || '0'} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              No. of Wristbands
            </Typography>
            <TextField fullWidth placeholder="Number of Wristbands" disabled value={schoolData.wristbands || '0'} />
          </Grid> */}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ViewSchoolModal;
