/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { CloseCircle, Profile2User, User, People } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';

const CreateStudentModal = ({ open, onClose, onSubmit, isLoading = false, schoolId }) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    studentCode: '',
    className: '',
    status: 'ACTIVE'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '90%', md: 700 },
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };

      switch (name) {
        case 'name':
          if (!value || value.trim().length < 2) {
            errors.name = 'Student name must be at least 2 characters long';
          } else {
            delete errors.name;
          }
          break;

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = 'Please enter a valid email address';
          } else {
            delete errors.email;
          }
          break;

        case 'studentCode':
          if (!value || value.trim().length < 3) {
            errors.studentCode = 'Student code must be at least 3 characters long';
          } else {
            delete errors.studentCode;
          }
          break;

        case 'className':
          if (!value) {
            errors.className = 'Please select a class';
          } else {
            delete errors.className;
          }
          break;
        default:
          break;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validationErrors]
  );

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Clear any existing error
      if (error) setError('');

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));

      // Validate field
      validateField(name, value);
    },
    [error, validateField]
  );

  const validateForm = useCallback(() => {
    const requiredFields = ['name', 'studentCode', 'className'];
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    // Prepare student data
    const studentData = {
      ...formData,
      //   schoolId: schoolId,
      status: 'ACTIVE'
    };

    // Remove empty fields
    Object.keys(studentData).forEach((key) => {
      if (!studentData[key]) {
        delete studentData[key];
      }
    });

    onSubmit(studentData);
  }, [formData, schoolId, onSubmit, validateForm]);

  const handleClose = useCallback(() => {
    // Reset form
    setFormData({
      name: '',
      email: '',
      studentCode: '',
      className: ''
    });
    setValidationErrors({});
    setError('');
    onClose();
  }, [onClose]);

  const isFormValid = formData.name && formData.studentCode && formData.className && Object.keys(validationErrors).length === 0;

  const classOptions = [
    'Nursery 1',
    'Nursery 2',
    'Kindergarten',
    'Primary 1',
    'Primary 2',
    'Primary 3',
    'Primary 4',
    'Primary 5',
    'Primary 6',
    'JSS 1',
    'JSS 2',
    'JSS 3',
    'SSS 1',
    'SSS 2',
    'SSS 3'
  ];

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-student-modal">
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
              <User size="24" color={theme.palette.primary.main} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600">
                Create New Student
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new student for this school
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseCircle size="24" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Student Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Profile2User size="20" color={theme.palette.text.primary} />
                Student Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                disabled={isLoading}
                required
                placeholder="Enter student's full name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Code"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleInputChange}
                error={!!validationErrors.studentCode}
                helperText={validationErrors.studentCode}
                disabled={isLoading}
                required
                placeholder="Enter unique student code"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class Name"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                error={!!validationErrors.className}
                helperText={validationErrors.className}
                disabled={isLoading}
                required
                placeholder="Enter student class name"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}
        >
          <Button variant="outlined" onClick={handleClose} disabled={isLoading} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <User size="20" />}
          >
            {isLoading ? 'Creating...' : 'Create Student'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateStudentModal;
