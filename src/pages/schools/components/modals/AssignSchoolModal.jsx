/* eslint-disable no-unused-vars */

import React from 'react';
import { Modal, Box, Typography, IconButton, Grid, TextField, MenuItem, Button } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/schoolConstants';

const AssignSchoolModal = ({ open, onClose, formData, onFormChange, onSubmit, schools }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ [name]: value });
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const isFormValid = formData.school && formData.count;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="assign-school-modal">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Assign Resources to School
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Assign POS devices and wristbands to a school.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              School Name
            </Typography>
            <TextField select fullWidth name="school" value={formData.school} onChange={handleInputChange}>
              <MenuItem value="Accra Academy">Accra Academy</MenuItem>
              <MenuItem value="Ghana International School">Ghana International School</MenuItem>
              <MenuItem value="VVU JHS">VVU JHS</MenuItem>
              <MenuItem value="Other School">Other School</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Number of POS Devices
            </Typography>
            <TextField
              fullWidth
              name="count"
              type="number"
              placeholder="Enter Number of POS Devices"
              value={formData.count}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!isFormValid}>
            Confirm & Issue
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignSchoolModal;
