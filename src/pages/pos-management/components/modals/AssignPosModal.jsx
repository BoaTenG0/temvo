/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Modal,
  IconButton,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { CloseCircle, SearchNormal1 } from 'iconsax-react';
import { modalStyle, schoolOptions } from '../../constants/posConstants';
import { useAssignToSchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const AssignPosModal = ({ open, onClose, formData, onFormChange, onSubmit, state, refetchPos, availablePosDevices = [], schools = [] }) => {
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPosDevices, setSelectedPosDevices] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const assignPos = useAssignToSchool();

  // Filter and paginate POS devices
  const filteredPosDevices = useMemo(() => {
    if (!searchQuery.trim()) {
      return availablePosDevices;
    }

    const query = searchQuery.toLowerCase();
    return availablePosDevices.filter(
      (pos) =>
        pos.id.toString().toLowerCase().includes(query) ||
        (pos.model && pos.model.toLowerCase().includes(query)) ||
        (pos.status && pos.status.toLowerCase().includes(query))
    );
  }, [availablePosDevices, searchQuery]);

  const paginatedPosDevices = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPosDevices.slice(startIndex, endIndex);
  }, [filteredPosDevices, page, rowsPerPage]);

  // Reset pagination when search changes
  React.useEffect(() => {
    setPage(0);
  }, [searchQuery]);

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

  const handleSchoolChange = useCallback(
    (event, newValue) => {
      // Clear any existing error for this field
      if (error) setError('');

      // Validate the field
      validateField('school', newValue?.id);

      // Update form data
      onFormChange({ school: newValue?.id || '' });
    },
    [error, onFormChange, validateField]
  );

  const handlePosSelection = useCallback(
    (posId) => {
      setSelectedPosDevices((prev) => {
        if (prev.includes(posId)) {
          return prev.filter((id) => id !== posId);
        } else {
          return [...prev, posId];
        }
      });

      // Clear error when selection changes
      if (error) setError('');
    },
    [error]
  );

  const handleSelectAllPos = useCallback(
    (checked) => {
      if (checked) {
        // Select all filtered devices (not just current page)
        setSelectedPosDevices(filteredPosDevices.map((pos) => pos.id));
      } else {
        setSelectedPosDevices([]);
      }
    },
    [filteredPosDevices]
  );

  const handleSelectAllCurrentPage = useCallback(
    (checked) => {
      if (checked) {
        // Select all devices on current page
        const currentPageIds = paginatedPosDevices.map((pos) => pos.id);
        setSelectedPosDevices((prev) => [...new Set([...prev, ...currentPageIds])]);
      } else {
        // Deselect all devices on current page
        const currentPageIds = paginatedPosDevices.map((pos) => pos.id);
        setSelectedPosDevices((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      }
    },
    [paginatedPosDevices]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    // Validate school selection
    const isSchoolValid = validateField('school', formData.school);

    // Validate POS device selection
    if (selectedPosDevices.length === 0) {
      setError('Please select at least one POS device');
      return;
    }

    if (!isSchoolValid) {
      setError('Please select a school');
      return;
    }

    const selectedSchool = schools?.find((school) => school.id === formData.school);

    const assignmentData = {
      schoolId: formData.school,
      posDeviceIds: selectedPosDevices
    };

    assignPos.mutate(assignmentData, {
      onSuccess: () => {
        refetchPos();
        // Show success message
        dispatch(
          openSnackbar({
            open: true,
            message: `${selectedPosDevices.length} POS device(s) assigned to ${selectedSchool?.name}`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        onClose();
        // Reset selections and search
        setSelectedPosDevices([]);
        setSearchQuery('');
        setPage(0);
      },
      onError: (err) => {
        setError(err.message || 'Failed to assign POS devices. Please try again.');
      }
    });
  }, [formData, schools, selectedPosDevices, validateField, assignPos, onClose, refetchPos]);

  const isLoading = assignPos.isPending;
  const isFormValid = formData.school && selectedPosDevices.length > 0;

  // Get selected school object for autocomplete
  const selectedSchool = schools?.find((school) => school.id === formData.school) || null;

  // Check if all current page items are selected
  const isCurrentPageSelected = paginatedPosDevices.length > 0 && paginatedPosDevices.every((pos) => selectedPosDevices.includes(pos.id));

  // Check if some current page items are selected
  const isCurrentPageIndeterminate = paginatedPosDevices.some((pos) => selectedPosDevices.includes(pos.id)) && !isCurrentPageSelected;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="assign-pos-modal">
      <Box sx={{ ...modalStyle, maxWidth: 900, width: '90%', height: 700, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Assign NFC POS Devices
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select POS devices and assign them to a school.
        </Typography>

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
            <Autocomplete
              options={schools?.filter((option) => option.name !== 'All') || []}
              getOptionLabel={(option) => option.name || ''}
              value={selectedSchool}
              onChange={handleSchoolChange}
              disabled={isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search and select a school"
                  error={!!validationErrors.school}
                  helperText={validationErrors.school}
                  fullWidth
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              noOptionsText="No schools found"
              clearOnEscape
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">Available POS Devices * ({selectedPosDevices.length} selected)</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPosDevices.length === filteredPosDevices.length && filteredPosDevices.length > 0}
                      indeterminate={selectedPosDevices.length > 0 && selectedPosDevices.length < filteredPosDevices.length}
                      onChange={(e) => handleSelectAllPos(e.target.checked)}
                      disabled={isLoading || filteredPosDevices.length === 0}
                    />
                  }
                  label="Select All Filtered"
                />
              </Box>
            </Box>

            {/* Search Field */}
            <TextField
              fullWidth
              placeholder="Search by Device ID, Model, or Status"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size="20" />
                  </InputAdornment>
                )
              }}
            />

            {availablePosDevices.length === 0 ? (
              <Alert severity="info">No POS devices available for assignment.</Alert>
            ) : filteredPosDevices.length === 0 ? (
              <Alert severity="info">No POS devices match your search criteria.</Alert>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isCurrentPageSelected}
                            indeterminate={isCurrentPageIndeterminate}
                            onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                            disabled={isLoading || paginatedPosDevices.length === 0}
                          />
                        </TableCell>
                        <TableCell>Device ID</TableCell>
                        <TableCell>Device Model</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPosDevices.map((pos) => (
                        <TableRow key={pos.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedPosDevices.includes(pos.id)}
                              onChange={() => handlePosSelection(pos.id)}
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>{pos.id}</TableCell>
                          <TableCell>{pos.model || `POS-${pos.id}`}</TableCell>
                          <TableCell>
                            <Chip
                              label={pos.status || 'Available'}
                              color={pos.status === 'Available' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredPosDevices.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  showFirstButton
                  showLastButton
                />
              </>
            )}
          </Grid>

          {formData.school && selectedPosDevices.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                {`You are about to assign ${selectedPosDevices.length} POS device(s) to ${
                  schools?.find((s) => s.id === formData.school)?.name || 'the selected school'
                }.`}
              </Alert>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Assigning...' : `Assign ${selectedPosDevices.length} Device(s)`}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignPosModal;
