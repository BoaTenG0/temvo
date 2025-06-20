/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { People, SearchNormal1, User, Calendar, Profile2User, Trash, Edit2, Additem, Warning2, Add } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useCreateStudent, useDeleteStudent, useGetStudentsBySchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import CreateStudentModal from './createStudent';
const StudentsSection = ({ schoolId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const {
    data: studentsData,
    isLoading,
    error,
    refetch: refetchStudents
  } = useGetStudentsBySchool({ page, size, search: searchTerm }, schoolId);

  const students = studentsData?.content || [];

  const deleteStudent = useDeleteStudent();

  const createStudent = useCreateStudent();

  const handleAddStudent = async (studentData) => {
    createStudent.mutate(studentData, {
      onSuccess: (response) => {
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Student registered successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        handleCloseModal();
        refetchStudents();
      },
      onError: (error) => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error creating student: ' + error.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    });
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (student) => {
    setDeleteModalOpen(true);
    setStudentToDelete(student);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent.mutate(studentToDelete.id, {
        onSuccess: () => {
          refetchStudents();
          handleCloseDeleteModal();
          dispatch(
            openSnackbar({
              open: true,
              message: `Student "${studentToDelete.name}" deleted successfully`,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
        },
        onError: (err) => {
          handleCloseDeleteModal();
          dispatch(
            openSnackbar({
              open: true,
              message: err.message || 'Failed to delete student. Please try again.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">Failed to load students: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <People size="28" color={theme.palette.secondary.main} />
        <Typography variant="h4" fontWeight="600">
          Students
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="secondary.main">
                    {studentsData?.totalElements || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                  <People size="24" color={theme.palette.secondary.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Students
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {students.filter((s) => s.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <Profile2User size="24" color={theme.palette.success.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Page
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="info.main">
                    {page + 1}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <User size="24" color={theme.palette.info.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField
          //   fullWidth
          label="Search Students"
          placeholder="Search by name or student code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchNormal1 size="20" color={theme.palette.action.active} />
              </InputAdornment>
            )
          }}
        />
        {/* <Button variant="contained" startIcon={<Add size="20" />} onClick={() => setCreateModalOpen(true)}>
          Add Student
        </Button> */}
      </Paper>

      {/* Students Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Student Code</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Date Enrolled</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                        <Typography variant="body2" fontWeight="600">
                          {getInitials(student.name || 'Student')}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {student.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {student.studentCode || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.className || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={student.status || 'ACTIVE'} color={student.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.parentName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{student.createdAt ? formatDate(student.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1}>
                      {/* <Tooltip title="Assign Wristband to Student">
                        <IconButton
                          size="small"
                          // onClick={() => handleOpenModal('assign', student)}
                          disabled={student.wristbandId}
                          color="info"
                        >
                          <Additem size={18} />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Delete Student">
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteModal(student)}>
                          <Trash size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={studentsData?.totalElements || 0}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(event) => {
            setSize(Number.parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: theme.palette.error.light }}>
              <Warning2 size="24" color={theme.palette.error.main} />
            </Avatar>
            <Typography variant="h5" fontWeight="600">
              Delete Student
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <Typography component="span" fontWeight="600" color="text.primary">
              {studentToDelete?.name || 'this student'}
            </Typography>
            ? This action cannot be undone and will permanently remove the student from your system.
          </DialogContentText>

          {studentToDelete && (
            <Box mt={2} p={2} bgcolor={theme.palette.grey[50]} borderRadius={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Student Details:
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {studentToDelete.name || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Student Code:</strong> {studentToDelete.studentCode || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Class:</strong> {studentToDelete.className || 'N/A'}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleCloseDeleteModal} variant="outlined" color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteStudent.isLoading}
            startIcon={deleteStudent.isLoading ? <CircularProgress size={16} /> : <Trash size={16} />}
          >
            {deleteStudent.isLoading ? 'Deleting...' : 'Delete Student'}
          </Button>
        </DialogActions>
      </Dialog>

      <CreateStudentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAddStudent}
        isLoading={createStudent.isPending}
        schoolId={schoolId}
      />
    </Box>
  );
};

export default StudentsSection;
