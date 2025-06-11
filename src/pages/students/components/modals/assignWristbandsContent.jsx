
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

export function AssignWristbandsContent({ students, selectedStudents: initialSelected, onAction, loading }) {
  const [selectedStudents, setSelectedStudents] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');
  const [wristbandPrefix, setWristbandPrefix] = useState('WB-');

  // Filter unassigned students
  const unassignedStudents = students.filter(
    (student) =>
      student.status === 'Unassigned' &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(unassignedStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleAssign = () => {
    const assignmentData = {
      studentIds: selectedStudents,
      wristbandPrefix,
      assignmentDate: new Date().toISOString()
    };
    onAction(assignmentData);
  };

  const isAllSelected = selectedStudents.length === unassignedStudents.length && unassignedStudents.length > 0;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select students to assign wristbands. Only unassigned students are shown.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Wristband ID Prefix"
          value={wristbandPrefix}
          onChange={(e) => setWristbandPrefix(e.target.value)}
          helperText="Wristband IDs will be generated with this prefix"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Search students..."
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

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </Box>

      <TableContainer sx={{ maxHeight: 300, mb: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unassignedStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {unassignedStudents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchTerm ? 'No students found matching your search.' : 'All students have been assigned wristbands.'}
          </Typography>
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAssign} disabled={selectedStudents.length === 0 || loading} sx={{ minWidth: 120 }}>
          {loading ? 'Assigning...' : `Assign Wristbands (${selectedStudents.length})`}
        </Button>
      </DialogActions>
    </Box>
  );
}
