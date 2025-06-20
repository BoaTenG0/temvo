import React, { useState, useCallback } from 'react';
import { Grid, Typography, TextField, MenuItem, Button, Alert, CircularProgress } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useAssignWristbandToSchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const AssignWristbandModal = ({ open, onClose, formData, onFormChange, schools, state, refetchWristbands }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  //   const assignWristbandMutation = useAssignWristbandToSchool();
  const assignWristbandMutation = useAssignWristbandToSchool(state?.wristbandData?.id);

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...validationErrors };

      switch (name) {
        case 'school':
          if (!value) {
            errors.school = 'Please select a school';
          } else {
            delete errors.school;
          }
          break;
        case 'count':
          if (!value || value <= 0) {
            errors.count = 'Number of wristbands must be greater than 0';
          } else if (value > 1000) {
            errors.count = 'Cannot assign more than 1000 wristbands at once';
          } else {
            delete errors.count;
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

      // Clear any existing error for this field
      if (error) setError('');

      // Validate the field
      validateField(name, value);

      // Update form data
      onFormChange({ [name]: value });
    },
    [error, onFormChange, validateField]
  );

  const handleSubmit = useCallback(() => {
    // Validate all fields before submission
    const isSchoolValid = validateField('school', formData.school);
    const isCountValid = validateField('count', formData.count);

    if (!isSchoolValid || !isCountValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    // Check if wristband ID is available
    if (!state?.wristbandData?.id) {
      setError('Wristband ID is missing. Please try again.');
      return;
    }

    const selectedSchool = schools?.find((school) => school.id === formData.school);

    const assignmentData = {
      //   wristbandId: state.wristbandData.id, // Add the wristband ID
      schoolId: formData.school
      //   schoolName: selectedSchool?.name,
      //   count: parseInt(formData.count, 10)
    };

    assignWristbandMutation.mutate(assignmentData, {
      onSuccess: () => {
        refetchWristbands();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `Wristband assigned to  ${selectedSchool?.name}`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        onClose();
      },
      onError: (err) => {
        setError(err.message || 'Failed to assign wristbands. Please try again.');
      }
    });
  }, [formData, schools, validateField, assignWristbandMutation, onClose, state?.wristbandData?.id]);

  const isFormValid = () => {
    return formData.school && formData.count && formData.count > 0 && Object.keys(validationErrors).length === 0;
  };

  const isLoading = assignWristbandMutation.isPending;

  const renderContent = () => (
    <Grid container spacing={3}>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          School Name *
        </Typography>
        <TextField
          select
          fullWidth
          name="school"
          value={formData.school || ''}
          onChange={handleInputChange}
          error={!!validationErrors.school}
          helperText={validationErrors.school}
          disabled={isLoading}
          placeholder="Select a school"
        >
          {schools
            ?.filter((option) => option.name !== 'All')
            .map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Number of Wristbands *
        </Typography>
        <TextField
          fullWidth
          name="count"
          type="number"
          placeholder="Enter number of wristbands"
          value={formData.count || ''}
          onChange={handleInputChange}
          error={!!validationErrors.count}
          helperText={validationErrors.count}
          disabled={isLoading}
          inputProps={{
            min: 1,
            max: 1000,
            step: 1
          }}
        />
      </Grid>

      {formData.school && formData.count && (
        <Grid item xs={12}>
          <Alert severity="info">
            {`You are about to assign ${formData.count} wristband(s) to ${
              schools?.find((s) => s.id === formData.school)?.name || 'the selected school'
            }.`}
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  const actions = [
    <Button key="clear" variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button
      key="confirm"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={!isFormValid() || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : null}
    >
      {isLoading ? 'Assigning...' : 'Confirm & Issue'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Assign Wristbands"
      description="Assign wristbands to schools in the TEMVO POS system."
      actions={actions}
      ariaLabelledBy="assign-wristband-modal"
    >
      {renderContent()}
    </ReusableModal>
  );
};

export default AssignWristbandModal;
