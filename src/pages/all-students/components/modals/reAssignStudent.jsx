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
  FormHelperText,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { CloseCircle, Profile2User, Buildings2, ArrowRight, Warning2 } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';

const ReassignStudentModal = ({ open, onClose, student, schools = [], onSubmit, isLoading = false }) => {
  const theme = useTheme();

  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '90%', md: 600 },
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
        case 'newSchoolId':
          if (!value) {
            errors.newSchoolId = 'Please select a school';
          } else if (value === student?.currentSchoolId) {
            errors.newSchoolId = 'Student is already in this school';
          } else {
            delete errors.newSchoolId;
          }
          break;
        default:
          break;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [validationErrors, student]
  );

  const handleSchoolChange = useCallback(
    (e) => {
      const { value } = e.target;

      // Clear any existing error
      if (error) setError('');

      // Update selected school
      setSelectedSchoolId(value);

      // Validate field
      validateField('newSchoolId', value);
    },
    [error, validateField]
  );

  const handleSubmit = useCallback(() => {
    if (!validateField('newSchoolId', selectedSchoolId)) {
      setError('Please select a valid school');
      return;
    }

    if (!student?.id) {
      setError('Student information is missing');
      return;
    }

    // Prepare reassignment data
    const reassignmentData = {
      newSchoolId: selectedSchoolId,
      studentId: student.id
    };

    onSubmit(reassignmentData);
  }, [selectedSchoolId, student, onSubmit, validateField]);

  const handleClose = useCallback(() => {
    // Reset form
    setSelectedSchoolId('');
    setValidationErrors({});
    setError('');
    onClose();
  }, [onClose]);

  const isFormValid = selectedSchoolId && Object.keys(validationErrors).length === 0;

  // Filter out current school and 'All' option
  const availableSchools =
    schools?.filter((school) => school.id !== student?.currentSchoolId && school.name !== 'All' && school.id !== 'All') || [];

  const selectedSchool = schools?.find((school) => school.id === selectedSchoolId);
  const currentSchool = schools?.find((school) => school.id === student?.currentSchoolId);

  if (!student) {
    return null;
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="reassign-student-modal">
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
            <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
              <ArrowRight size="24" color={theme.palette.warning.main} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600">
                Reassign Student
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transfer student to a different school
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

          {/* Student Information Card */}
          <Card elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Profile2User size="20" color={theme.palette.text.primary} />
                Student Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Student Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {student.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Student Code
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {student.studentCode || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Class
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {student.className || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current School
                    </Typography>
                    <Chip label={currentSchool?.name || 'Unknown School'} color="primary" size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* School Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Buildings2 size="20" color={theme.palette.text.primary} />
              Select New School
            </Typography>

            <FormControl fullWidth required error={!!validationErrors.newSchoolId}>
              <InputLabel>New School</InputLabel>
              <Select
                value={selectedSchoolId}
                onChange={handleSchoolChange}
                disabled={isLoading || availableSchools.length === 0}
                label="New School"
                placeholder="Select a school"
              >
                {availableSchools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                      <Typography variant="body1">{school.name}</Typography>
                      {school.location && (
                        <Typography variant="caption" color="text.secondary">
                          {school.location}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.newSchoolId && <FormHelperText>{validationErrors.newSchoolId}</FormHelperText>}
              {availableSchools.length === 0 && <FormHelperText>No other schools available for transfer</FormHelperText>}
            </FormControl>
          </Box>

          {/* Transfer Preview */}
          {selectedSchool && (
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.info.light}`,
                bgcolor: theme.palette.info.lighter || theme.palette.info.light + '20'
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArrowRight size="20" color={theme.palette.info.main} />
                  Transfer Summary
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      From
                    </Typography>
                    <Chip label={currentSchool?.name || 'Current School'} color="default" size="small" />
                  </Box>

                  <ArrowRight size="24" color={theme.palette.text.secondary} />

                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      To
                    </Typography>
                    <Chip label={selectedSchool.name} color="success" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Warning Alert */}
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Reassigning this student will transfer all their records to the new school. This action cannot be
              easily undone. Please confirm the transfer details before proceeding.
            </Typography>
          </Alert>
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
            disabled={!isFormValid || isLoading || availableSchools.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : <ArrowRight size="20" />}
            color="warning"
          >
            {isLoading ? 'Reassigning...' : 'Confirm Transfer'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReassignStudentModal;
