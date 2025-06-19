/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  InputAdornment,
  Chip,
  DialogActions
} from '@mui/material';
import { SearchNormal1 } from 'iconsax-react';

export function AssignWristbandsContent({ onAction, loading, currentSchoolWristband, onClose }) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSelectStudent = (wristbandId, checked) => {
    if (checked) {
      // Only allow one selection at a time
      setSelectedStudents([wristbandId]);
    } else {
      setSelectedStudents([]);
    }
  };
  const handleAssign = () => {
    if (selectedStudents.length === 0) return;
    // We're selecting a single wristband to assign to the student
    const wristbandId = selectedStudents[0];
    const assignmentData = {
      wristbandId
    };
    onAction(assignmentData);
  };

  const wristbands = currentSchoolWristband?.data?.content;
  //   const isAllSelected = selectedStudents.length === unassignedStudents.length && unassignedStudents.length > 0;
  //   const activeWristband = wristbands.filter((student) => student.status === 'active');

  const activeWristband = wristbands.filter(
    (student) =>
      student.status === 'active' &&
      (student.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select wristband to assign student to. Only unassigned wristbands are shown.
      </Typography>

      <Box sx={{ mb: 3 }}>
        {/* <TextField
          fullWidth
          label="Wristband ID Prefix"
          value={wristbandPrefix}
          onChange={(e) => setWristbandPrefix(e.target.value)}
          helperText="Wristband IDs will be generated with this prefix"
          sx={{ mb: 2 }}
        /> */}
        <TextField
          fullWidth
          placeholder="Search wristbands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchNormal1 size={18} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Checkbox
            checked={isAllSelected}
            indeterminate={selectedStudents.length > 0 && selectedStudents.length < unassignedStudents.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <Typography component="span" variant="body2">
            Select All ({unassignedStudents.length} students)
          </Typography>
        </Box>
        <Chip label={`${selectedStudents.length} selected`} color="primary" variant="outlined" />
      </Box> */}

      <TableContainer sx={{ maxHeight: 300, mb: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>Model Name</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Serial Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeWristband?.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{student.model}</TableCell>
                <TableCell>{student.modelNumber}</TableCell>
                <TableCell>{student.serialNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {activeWristband?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchTerm ? 'No wristband found matching your search.' : 'All wristbands have been assigned to students.'}
          </Typography>
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAssign} disabled={selectedStudents.length === 0 || loading} sx={{ minWidth: 120 }}>
          {loading ? 'Assigning...' : `Assign Wristbands`}
        </Button>
      </DialogActions>
    </Box>
  );
}
