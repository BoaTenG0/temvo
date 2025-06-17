/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  Chip,
  useTheme,
  Grid,
  Tooltip
} from '@mui/material';
import { SearchNormal1, Add, Edit2, Trash, DocumentUpload, TicketStar, Additem } from 'iconsax-react';
import { ThemeProvider } from './components/theme-provider';
import { StudentActionModal } from './components/modals/studentActionModal';
import { StudentFilters } from './components/showFilters';
import { useBulkUploadStudents, useCreateStudent, useGetStudentBySchoolId } from 'api/requests';
import { useSelector } from 'store';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import dayjs from 'dayjs';

// Mock data
const students = [
  {
    id: '001',
    name: 'Kweku Sampson',
    studentId: '220GA201004',
    class: 'Form 1',
    status: 'Assigned',
    wristbandId: 'WB-3452199',
    assignmentDate: '17/02/2025'
  },
  {
    id: '002',
    name: 'Kojo Sampson',
    studentId: '220GA201004',
    class: 'Form 2',
    status: 'Unassigned',
    wristbandId: 'WB-3452199',
    assignmentDate: '17/02/2025'
  },
  {
    id: '003',
    name: 'Ama Johnson',
    studentId: '220GA201005',
    class: 'Form 1',
    status: 'Assigned',
    wristbandId: 'WB-3452200',
    assignmentDate: '18/02/2025'
  },
  {
    id: '004',
    name: 'Kofi Mensah',
    studentId: '220GA201006',
    class: 'Form 3',
    status: 'Assigned',
    wristbandId: 'WB-3452201',
    assignmentDate: '18/02/2025'
  },
  {
    id: '005',
    name: 'Abena Owusu',
    studentId: '220GA201007',
    class: 'Form 2',
    status: 'Unassigned',
    wristbandId: '',
    assignmentDate: ''
  }
];

export default function StudentManagement() {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.user.userInfo);
  const initialStartDate = dayjs().subtract(7, 'days');
  const initialEndDate = dayjs();
  // Consolidated state management
  const [state, setState] = useState({
    // Table pagination state
    page: 0,
    rowsPerPage: 10,

    // Filter state
    filters: {
      selectedClass: 'All',
      selectedStatus: 'All',
      dateRange: [initialStartDate.toDate(), initialEndDate.toDate()],
      searchTerm: '',
      showFilters: true
    },

    // Modal state
    modal: {
      isOpen: false,
      type: null,
      loading: false,
      selectedStudents: []
    },

    // Table search state
    tableSearchTerm: ''
  });

  const { data, refetch: refetchStudents } = useGetStudentBySchoolId({}, userInfo?.schoolId);
  const createStudent = useCreateStudent();
  const bulkCreateStudent = useBulkUploadStudents();

  const handleBulkUpload = async (file) => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    bulkCreateStudent.mutate(formData, {
      onSuccess: (response) => {
        console.log('🚀 ~ handleBulkUpload ~ response:', response);
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Students registered successfully',
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
            message: 'Error uploading students: ' + error.message,
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

  const handleAddStudent = async (studentData) => {
    createStudent.mutate(studentData, {
      onSuccess: (response) => {
        console.log('🚀 ~ handleAddStudent ~ response:', response);
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

  // State update helpers
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateFilters = (filterUpdates) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filterUpdates }
    }));
  };

  const updateModal = (modalUpdates) => {
    setState((prev) => ({
      ...prev,
      modal: { ...prev.modal, ...modalUpdates }
    }));
  };

  // Modal handlers
  const handleOpenModal = (type) => {
    updateModal({
      isOpen: true,
      type,
      selectedStudents: type === 'assign' ? [] : state.modal.selectedStudents
    });
  };

  const handleCloseModal = () => {
    updateModal({
      isOpen: false,
      type: null,
      loading: false,
      selectedStudents: []
    });
  };

  const handleModalAction = async (data) => {
    updateModal({ loading: true });

    try {
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1500));

      // Handle different modal actions
      switch (state.modal.type) {
        case 'assign':
          console.log('Assigning wristbands to students:', data);
          break;
        case 'add':
          handleAddStudent(data);
          break;
        case 'bulk':
          handleBulkUpload(data.file);
          console.log('Bulk enrolling students:', data);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      updateModal({ loading: false });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    updateState({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    updateState({
      rowsPerPage: Number.parseInt(event.target.value, 10),
      page: 0
    });
  };

  // Count students with and without wristbands
  const withWristbands = students.filter((student) => student.status === 'Assigned').length;
  const withoutWristbands = students.filter((student) => student.status === 'Unassigned').length;

  // Filter students based on selected filters
  const filteredStudents = students.filter((student) => {
    const matchesClass = state.filters.selectedClass === 'All' || student.class === state.filters.selectedClass;
    const matchesStatus = state.filters.selectedStatus === 'All' || student.status === state.filters.selectedStatus;
    const matchesGlobalSearch =
      student.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
      student.wristbandId.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
    const matchesTableSearch =
      student.name.toLowerCase().includes(state.tableSearchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(state.tableSearchTerm.toLowerCase()) ||
      student.wristbandId.toLowerCase().includes(state.tableSearchTerm.toLowerCase());

    return matchesClass && matchesStatus && matchesGlobalSearch && matchesTableSearch;
  });

  return (
    <ThemeProvider>
      <Grid>
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Manage Students
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Perform actions for students in the TEMVO ecosystem
          </Typography>
        </Box>

        <StudentFilters
          filters={state.filters}
          onFiltersChange={updateFilters}
          withWristbands={withWristbands}
          withoutWristbands={withoutWristbands}
        />

        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2}
            borderBottom={`1px solid ${theme.palette.divider}`}
          >
            <Typography variant="h6" component="h2">
              Student List
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<TicketStar size={18} variant="Bold" />}
                sx={{ mr: 1 }}
                onClick={() => handleOpenModal('assign')}
              >
                Assign Wristbands
              </Button>
              <Button variant="outlined" startIcon={<Add size={18} />} sx={{ mr: 1 }} onClick={() => handleOpenModal('add')}>
                Add Student
              </Button>
              <Button variant="contained" startIcon={<DocumentUpload size={18} />} onClick={() => handleOpenModal('bulk')}>
                Add Bulk Students
              </Button>
            </Box>
          </Box>

          <Box px={3} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <TextField select size="small" value={state.rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ width: 80, mr: 1 }}>
                {[5, 10, 25, 50].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2" color="text.secondary">
                entries per page
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search"
              value={state.tableSearchTerm}
              onChange={(e) => updateState({ tableSearchTerm: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={18} />
                  </InputAdornment>
                )
              }}
              sx={{ width: 250 }}
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>STUDENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>STUDENT ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CLASS</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ASSIGNED WRISTBAND ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>WRISTBAND ASSIGNMENT DATE</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents
                  .slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage)
                  .map((student) => (
                    <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          size="small"
                          color={student.status === 'Assigned' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{student.wristbandId}</TableCell>
                      <TableCell>{student.assignmentDate}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Assign Wristband">
                          <IconButton size="small" color="info">
                            <Additem size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Student">
                          <IconButton size="small" color="primary">
                            <Edit2 size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <IconButton size="small" color="error">
                            <Trash size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={state.rowsPerPage}
            page={state.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <StudentActionModal
          open={state.modal.isOpen}
          type={state.modal.type}
          loading={state.modal.loading}
          selectedStudents={state.modal.selectedStudents}
          onClose={handleCloseModal}
          onAction={handleModalAction}
          students={students}
          onAdd={createStudent.isPending}
        />
      </Grid>
    </ThemeProvider>
  );
}
