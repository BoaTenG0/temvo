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
  Tooltip,
  CircularProgress,
  Checkbox
} from '@mui/material';
import { SearchNormal1, Add, Edit2, Trash, DocumentUpload, TicketStar, Additem } from 'iconsax-react';
import { ThemeProvider } from './components/theme-provider';
import { StudentActionModal } from './components/modals/studentActionModal';
import { StudentFilters } from './components/showFilters';
import DeleteConfirmationModal from '../../components/modal/DeleteConfirmationModal';
import {
  useBulkUploadStudents,
  useCreateStudent,
  useDeleteStudent,
  useEditStudent,
  useGetStudentBySchoolId,
  useUpdateStudentStatus,
  useBulkDeleteStudents,
  useGetWristbandsForCurrentSchool,
  useAssignWristbandToStudent
} from 'api/requests';
import { useSelector } from 'store';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import dayjs from 'dayjs';
import { ParentName } from 'pages/nfc-wristbands/components/getParentName';
import { SchoolName } from 'pages/nfc-wristbands/components/getSchoolName';
import { WristbandName } from 'pages/nfc-wristbands/components/getWristbandName';
import StudentActions from './studentActions';

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
      selectedStudents: [],
      studentToEdit: null
    },

    // Delete confirmation modal state
    deleteModal: {
      isOpen: false,
      studentToDelete: null,
      isDeleting: false
    },

    // Selected students for bulk actions
    selectedStudents: [],

    // Table search state
    tableSearchTerm: ''
  });

  const { data, refetch: refetchStudents, isLoading } = useGetStudentBySchoolId({}, userInfo?.schoolId);

  const { data: currentSchoolWristband } = useGetWristbandsForCurrentSchool(userInfo?.schoolId);

  const createStudent = useCreateStudent();
  const editStudent = useEditStudent();
  const updateStudentStatus = useUpdateStudentStatus();
  const bulkCreateStudent = useBulkUploadStudents();
  const deleteStudent = useDeleteStudent();
  const deleteBulkStudent = useBulkDeleteStudents();
  const assignWristbandToSchool = useAssignWristbandToStudent();

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
  const handleOpenModal = (type, student = null) => {
    if (type === 'bulkDelete') {
      // For bulk delete, use the delete confirmation modal instead
      setState((prev) => ({
        ...prev,
        deleteModal: {
          isOpen: true,
          studentToDelete: null,
          isDeleting: false
        }
      }));
      return;
    }

    updateModal({
      isOpen: true,
      type,
      selectedStudents: type === 'assign' ? (student ? [student.id] : []) : state.selectedStudents,
      studentToEdit: student
    });
  };
  const handleCloseModal = () => {
    updateModal({
      isOpen: false,
      type: null,
      loading: false,
      selectedStudents: [],
      studentToEdit: null
    });
  };
  const handleEditStudent = (studentData) => {
    const studentId = state.modal.studentToEdit?.id;
    if (!studentId) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error: Student ID is missing',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      return;
    }

    editStudent.mutate(
      { studentId, ...studentData },
      {
        onSuccess: (response) => {
          dispatch(
            openSnackbar({
              open: true,
              message: response.message || 'Student updated successfully',
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
              message: 'Error updating student: ' + error.message,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }
    );
  };
  const handleUpdateStudentStatus = (student) => {
    const studentId = student.id;
    if (!studentId) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Error: Student ID is missing',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      return;
    }

    updateStudentStatus.mutate(
      { studentId, status: student.status },
      {
        onSuccess: (response) => {
          dispatch(
            openSnackbar({
              open: true,
              message: response.message || 'Student status updated successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          refetchStudents();
        },
        onError: (error) => {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Error updating student status: ' + error.message,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }
    );
  };

  const handleDeleteStudent = () => {
    deleteStudent.mutate(null, {
      onSuccess: () => {
        refetchStudents();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `Student deleted successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      },
      onError: (err) => {
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
  };

  const handleBulkDeleteStudents = (selectedStudents) => {
    if (selectedStudents.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select at least one student to delete.',
          variant: 'alert',
          alert: {
            color: 'warning'
          },
          close: true
        })
      );
      return;
    }
    deleteBulkStudent.mutate(
      //   { studentIds: selectedStudents },
      selectedStudents,
      {
        onSuccess: () => {
          refetchStudents();
          // Close modal on success
          dispatch(
            openSnackbar({
              open: true,
              message: `Students deleted successfully`,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
        },
        onError: (err) => {
          dispatch(
            openSnackbar({
              open: true,
              message: err.message || 'Failed to delete students. Please try again.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }
    );
  };

  const handleDeleteConfirmation = (student) => {
    setState((prev) => ({
      ...prev,
      deleteModal: {
        isOpen: true,
        studentToDelete: student,
        isDeleting: false
      }
    }));
  };

  const handleCloseDeleteModal = () => {
    setState((prev) => ({
      ...prev,
      deleteModal: {
        isOpen: false,
        studentToDelete: null,
        isDeleting: false
      }
    }));
  };
  const handleDeleteConfirmed = async () => {
    const { studentToDelete } = state.deleteModal;
    setState((prev) => ({
      ...prev,
      deleteModal: { ...prev.deleteModal, isDeleting: true }
    }));
    const assignData = {
      studentIds: Object.values(state.selectedStudents || [])
    };

    if (studentToDelete) {
      // Single student delete
      deleteStudent.mutate(
        { studentId: studentToDelete.id },
        {
          onSuccess: () => {
            refetchStudents();
            dispatch(
              openSnackbar({
                open: true,
                message: `Student deleted successfully`,
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: true
              })
            );
            handleCloseDeleteModal();
          },
          onError: (err) => {
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
            setState((prev) => ({
              ...prev,
              deleteModal: { ...prev.deleteModal, isDeleting: false }
            }));
          }
        }
      );
    } else {
      // Bulk delete
      deleteBulkStudent.mutate(
        // { studentIds: state.selectedStudents },
        // state.selectedStudents || [],
        // Object.values(state.selectedStudents || []),
        assignData,
        {
          onSuccess: () => {
            refetchStudents();
            dispatch(
              openSnackbar({
                open: true,
                message: `${state.selectedStudents.length} students deleted successfully`,
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: true
              })
            );
            // Clear selected students after successful deletion
            setState((prev) => ({
              ...prev,
              selectedStudents: [],
              deleteModal: {
                isOpen: false,
                studentToDelete: null,
                isDeleting: false
              }
            }));
          },
          onError: (err) => {
            dispatch(
              openSnackbar({
                open: true,
                message: err.message || 'Failed to delete students. Please try again.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: true
              })
            );
            setState((prev) => ({
              ...prev,
              deleteModal: { ...prev.deleteModal, isDeleting: false }
            }));
          }
        }
      );
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.data?.map((student) => student.id) || [];
      setState((prev) => ({ ...prev, selectedStudents: newSelected }));
      return;
    }
    setState((prev) => ({ ...prev, selectedStudents: [] }));
  };

  const handleSelectStudent = (event, studentId) => {
    const selectedStudents = [...state.selectedStudents];
    if (event.target.checked) {
      selectedStudents.push(studentId);
    } else {
      const index = selectedStudents.indexOf(studentId);
      if (index > -1) {
        selectedStudents.splice(index, 1);
      }
    }
    setState((prev) => ({ ...prev, selectedStudents }));
  };

  const isSelected = (studentId) => state.selectedStudents.indexOf(studentId) !== -1;

  const handleModalAction = async (data) => {
    updateModal({ loading: true });

    try {
      if (data.type === 'status') {
        // Handle status update
        handleUpdateStudentStatus(data);
        updateModal({ loading: false });
        return;
      }

      const studentId = state.modal.selectedStudents[0];
      // Handle different modal actions
      switch (state.modal.type) {
        case 'assign':
          handleAssignWristband(studentId, data.wristbandId);
          break;
        case 'add':
          handleAddStudent(data);
          break;
        case 'bulk':
          handleBulkUpload(data.file);
          break;
        case 'edit':
          handleEditStudent(data);
          break;
        case 'delete':
          handleDeleteStudent(data);
          break;
        case 'bulkDelete':
          handleBulkDeleteStudents(state.modal.selectedStudents);
          break;
        default:
          console.error('Unknown modal type:', state.modal.type);
      }
    } catch (error) {
      console.error('Error:', error);
      updateModal({ loading: false });
    }
  };

  const handleAssignWristband = async (studentId, wristbandId) => {
    if (!studentId || studentId.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select at a student to assign a wristband to.',
          variant: 'alert',
          alert: {
            color: 'warning'
          },
          close: true
        })
      );
      return;
    }

    assignWristbandToSchool.mutate(
      { studentId, wristbandId },
      {
        onSuccess: (response) => {
          console.log('🚀 ~ handleAssignWristband ~ response:', response);
          dispatch(
            openSnackbar({
              open: true,
              message: response.message || 'Wristband assigned successfully',
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
        onError: (err) => {
          dispatch(
            openSnackbar({
              open: true,
              message: err.message || 'Failed to assign wristbands. Please try again.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      }
    );
  };
  // Search handler
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
              {state.selectedStudents.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Trash size={18} />}
                  sx={{ mr: 1 }}
                  onClick={() => handleOpenModal('bulkDelete')}
                >
                  Delete Selected ({state.selectedStudents.length})
                </Button>
              )}
              {/* <Button
                variant="outlined"
                startIcon={<TicketStar size={18} variant="Bold" />}
                sx={{ mr: 1 }}
                onClick={() => handleOpenModal('assign')}
              >
                Assign Wristbands
              </Button> */}
              <Button variant="outlined" startIcon={<Add size={18} />} sx={{ mr: 1 }} onClick={() => handleOpenModal('add')}>
                Add Student
              </Button>
              <Button variant="contained" startIcon={<DocumentUpload size={18} />} onClick={() => handleOpenModal('bulk')}>
                Add Bulk Students
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={state.selectedStudents.length > 0 && state.selectedStudents.length < data?.data?.length}
                      checked={data?.data?.length > 0 && state.selectedStudents.length === data?.data?.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>School</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Wristband</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Loading wristbands...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data?.content?.length > 0 ? (
                  data?.content?.map((student) => (
                    <TableRow key={student.id} hover selected={isSelected(student.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected(student.id)} onChange={(event) => handleSelectStudent(event, student.id)} />
                      </TableCell>
                      <TableCell>{student.name || 'N/A'}</TableCell>
                      <TableCell>{student.studentCode || 'N/A'}</TableCell>
                      <TableCell>
                        <ParentName parentId={student.parentId} />
                      </TableCell>
                      <TableCell>
                        <SchoolName schoolId={student.schoolId} />
                      </TableCell>
                      <TableCell>{student.className || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          size="small"
                          color={student.status === 'ACTIVE' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <WristbandName wristbandId={student.wristbandId} />
                      </TableCell>
                      <TableCell>{student.walletBalance || 'N/A'}</TableCell>{' '}
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          {' '}
                          <Tooltip title="Assign Student to Wristband">
                            <IconButton size="small" onClick={() => handleOpenModal('assign', student)} disabled={student.wristbandId} color="info">
                              <Additem size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Student">
                            <IconButton size="small" onClick={() => handleEditStudent(student)} color="primary">
                              <Edit2 size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Student">
                            <IconButton size="small" color="error" onClick={() => handleDeleteConfirmation(student)}>
                              <Trash size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No students found matching the current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data?.totalElements || 0}
            rowsPerPageOptions={[5, 10, 25, 50]}
            rowsPerPage={state.rowsPerPage}
            page={state.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
            sx={{
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 2,
                paddingRight: 2
              }
            }}
          />
        </Card>{' '}
        <StudentActionModal
          open={state.modal.isOpen}
          type={state.modal.type}
          loading={state.modal.loading}
          selectedStudents={state.modal.selectedStudents}
          onClose={handleCloseModal}
          onAction={handleModalAction}
          students={students}
          onAdd={createStudent.isPending}
          //   onStatusUpdate={updateStudentStatus.isPending}
          onEdit={editStudent.isPending}
          studentToEdit={state.modal.studentToEdit}
          currentSchoolWristband={currentSchoolWristband}
          OnAssign={assignWristbandToSchool.isPending}
        />
        <DeleteConfirmationModal
          open={state.deleteModal.isOpen}
          onClose={() => updateState({ deleteModal: { isOpen: false } })}
          onConfirm={handleDeleteConfirmed}
          loading={state.deleteModal.isDeleting}
          title={`Delete Student${state.deleteModal.studentToDelete ? `: ${state.deleteModal.studentToDelete?.name}` : 's'}`}
          message={
            state.deleteModal.studentToDelete
              ? 'Are you sure you want to delete this student? This action cannot be undone.'
              : `Are you sure you want to delete ${state.selectedStudents.length} selected students? This action cannot be undone.`
          }
        />
      </Grid>
    </ThemeProvider>
  );
}
