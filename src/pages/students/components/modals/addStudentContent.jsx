
import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export function AddStudentContent({ onAction, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    class: '',
    email: '',
    phone: ''
  });

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
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    if (!formData.class) {
      newErrors.class = 'Class is required';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAction(formData);
    }
  };

  const isFormValid = formData.name && formData.studentId && formData.class;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Register a new student in the TEMVO POS system.
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
            value={formData.studentId}
            onChange={handleChange('studentId')}
            error={!!errors.studentId}
            helperText={errors.studentId}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.class}>
            <InputLabel>Class</InputLabel>
            <Select
              value={formData.class}
              label="Class"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  class: e.target.value
                }))
              }
            >
              {classes.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
      </Grid>

      <DialogActions sx={{ px: 0, pt: 3 }}>
        <Button variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid || loading} sx={{ minWidth: 120 }}>
          {loading ? 'Registering...' : 'Register Student'}
        </Button>
      </DialogActions>
    </Box>
  );
}
