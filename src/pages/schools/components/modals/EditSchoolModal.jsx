import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { modalStyle } from '../../constants/schoolConstants';

const EditSchoolModal = ({ open, onClose, schoolData, onSubmit }) => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolNumber: '',
    schoolRegion: '',
    adminName: '',
    adminNumber: '',
    adminEmail: ''
  });

  useEffect(() => {
    if (schoolData) {
      setFormData({
        schoolName: schoolData.schoolName || '',
        schoolNumber: schoolData.schoolNumber || '',
        schoolRegion: schoolData.schoolRegion || '',
        adminName: schoolData.adminName || '',
        adminNumber: schoolData.adminNumber || '',
        adminEmail: schoolData.adminEmail || ''
      });
    }
  }, [schoolData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ ...schoolData, ...formData });
  };

  const isFormValid = formData.schoolName && formData.schoolNumber && formData.schoolRegion;

  if (!schoolData) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-school-details">
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Edit School Details
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
            <TextField
              fullWidth
              name="schoolName"
              placeholder="Enter School Name"
              value={formData.schoolName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              School ID
            </Typography>
            <TextField
              fullWidth
              name="schoolNumber"
              placeholder="Enter School ID"
              value={formData.schoolNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              School Region
            </Typography>
            <TextField
              fullWidth
              name="schoolRegion"
              placeholder="Enter School Region"
              value={formData.schoolRegion}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Name
            </Typography>
            <TextField
              fullWidth
              name="adminName"
              placeholder="Enter Admin Name"
              value={formData.adminName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Number
            </Typography>
            <TextField
              fullWidth
              name="adminNumber"
              placeholder="Enter Admin Number"
              value={formData.adminNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom>
              Admin Email
            </Typography>
            <TextField
              fullWidth
              name="adminEmail"
              placeholder="Enter Admin Email"
              value={formData.adminEmail}
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
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Update School
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSchoolModal;
