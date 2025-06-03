import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  IconButton
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/posConstants';

const NewPosModal = ({
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
    <Modal open={open} onClose={onClose} aria-labelledby="register-new-pos-modal">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Register New POS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Register a new POS in the TEMVO POS system.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Model Name
            </Typography>
            <TextField
              fullWidth
              name="modelName"
              placeholder="Enter Model Name"
              value={formData.modelName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Model Number
            </Typography>
            <TextField
              fullWidth
              name="modelNumber"
              placeholder="Enter Model Number"
              value={formData.modelNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Serial Number
            </Typography>
            <TextField
              fullWidth
              name="serialNumber"
              placeholder="Enter Serial Number"
              value={formData.serialNumber}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={!formData.modelName || !formData.modelNumber || !formData.serialNumber}
          >
            Register POS
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewPosModal;
