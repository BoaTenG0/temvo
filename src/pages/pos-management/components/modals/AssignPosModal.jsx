import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Modal,
  IconButton
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle, schoolOptions } from '../../constants/posConstants';

const AssignPosModal = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ [name]: value });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="assign-pos-modal">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Assign NFC POS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Assign NFC POS to a school.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              School Name
            </Typography>
            <TextField 
              select 
              fullWidth 
              name="school" 
              value={formData.school} 
              onChange={handleInputChange}
            >
              {schoolOptions.filter(option => option.value !== 'All').map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
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
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!formData.school || !formData.count}
          >
            Confirm & Issue
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignPosModal;
