/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export function AddStudentContent({ onAction, loading, onClose, onAdd, initialData, onEdit }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      studentCode: '',
      className: '',
      status: 'ACTIVE'
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }
    if (!formData.studentCode.trim()) {
      newErrors.studentCode = 'Student ID is required';
    }
    if (!formData.className) {
      newErrors.className = 'class is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAction(formData);
    }
  };

  const isFormValid = formData.name && formData.studentCode && formData.className;

  return (
    <Box>
      {' '}
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {initialData ? 'Edit student information in the TEMVO POS system.' : 'Register a new student in the TEMVO POS system.'}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Student Name"
            placeholder="Enter Student Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Student ID"
            placeholder="Enter Student ID"
            value={formData.studentCode}
            onChange={handleChange('studentCode')}
            error={!!errors.studentCode}
            helperText={errors.studentCode}
            required
          />
        </Grid>{' '}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Class Name"
            placeholder="Enter Class name"
            value={formData.className}
            onChange={handleChange('className')}
            error={!!errors.className}
            helperText={errors.className}
            required
          />
          {/* <FormControl fullWidth required error={!!errors.className}>
            <InputLabel>Class</InputLabel>
            <Select
              value={formData.className}
              label="Class"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  className: e.target.value
                }))
              }
            >
              {classes.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
              }
            >
              {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED', 'TRANSFERRED', 'WITHDRAWN'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email (Optional)"
            placeholder="Enter Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number (Optional)"
            placeholder="Enter Phone Number"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid> */}
      </Grid>
      <DialogActions sx={{ px: 0, pt: 3 }}>
        <Button variant="outlined" disabled={onAdd} onClick={onClose} sx={{ minWidth: 120 }}>
          Cancel
        </Button>{' '}
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid || onAdd} sx={{ minWidth: 120 }}>
          {onAdd || onEdit ? 'Saving...' : initialData ? 'Update Student' : 'Register Student'}
        </Button>
      </DialogActions>
    </Box>
  );
}
