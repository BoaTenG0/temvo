/* eslint-disable no-unused-vars */
import { useCallback, useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid, Button, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useCreateVendor } from 'api/requests';
import { oc } from 'date-fns/locale';
import { first } from 'lodash';

/* Initialize form data with vendor data when editing */
export function AddParentContent({ onAction, loading, onClose, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        occupation: initialData.occupation || '',
        emergencyContactName: initialData.emergencyContactName || '',
        emergencyContactPhone: initialData.emergencyContactPhone || ''
      });
    }
  }, [initialData, mode]);

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
      newErrors.name = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vendor contact is required';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }
    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        occupation: formData.occupation.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim()
      };

      // Add ID if editing
      if (mode === 'edit' && initialData?.id) {
        submitData.id = initialData.id;
      }

      onAction(submitData);
    }
  };
  const isFormValid = formData.name && formData.phone && formData.email;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Parent Name"
            placeholder="Enter Parent Name"
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
            label="Parent Contact"
            placeholder="Enter Parent Contact"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            placeholder="Enter Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange('address')}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Occupation"
            placeholder="Enter Occupation"
            value={formData.occupation}
            onChange={handleChange('occupation')}
            error={!!errors.occupation}
            helperText={errors.occupation}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Emergency Contact Name"
            placeholder="Enter Emergency Contact Name"
            value={formData.emergencyContactName}
            onChange={handleChange('emergencyContactName')}
            error={!!errors.emergencyContactName}
            helperText={errors.emergencyContactName}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Emergency Contact Phone"
            placeholder="Enter Emergency Contact Phone"
            value={formData.emergencyContactPhone}
            onChange={handleChange('emergencyContactPhone')}
            error={!!errors.emergencyContactPhone}
            helperText={errors.emergencyContactPhone}
          />
        </Grid>
      </Grid>

      <DialogActions sx={{ px: 0, pt: 3 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid || loading} sx={{ minWidth: 120 }}>
          {loading ? (mode === 'edit' ? 'Updating...' : 'Registering...') : mode === 'edit' ? 'Update Vendor' : 'Register Vendor'}
        </Button>
      </DialogActions>
    </Box>
  );
}
