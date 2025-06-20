/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import { useState } from 'react';
import { format } from 'date-fns';
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
  Tooltip,
  CircularProgress
} from '@mui/material';
import { SearchNormal1, Add, Edit2, Trash, DocumentUpload, MonitorMobbile, Additem, Refresh, Eye } from 'iconsax-react';
import { ThemeProvider } from '../students/components/theme-provider';
import { ParentFilters } from './component/parentFilters';
import { VendorActionModal } from './component/modals/vendorActionModal';
import {
  useAddParent,
  useEditVendor,
  useDeleteParent,
  useAssignWards,
  useGetParents,
  useGetStudentBySchoolId,
  useGetParentBySchoolIdd
} from 'api/requests';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { SchoolName } from 'pages/nfc-wristbands/components/getSchoolName';
import dayjs from 'dayjs';
import { convertDateJS } from 'utils/hooks';
import { lightBlue } from '@mui/material/colors';
import { useNavigate } from 'react-router';
// import { useSelector } from 'store';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

export default function VendorManagement() {
  const theme = useTheme();
  const navigate = useNavigate();
  // user data
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
      selectedStatus: 'All',
      selectedBusinessType: 'All',
      dateRange: [initialStartDate.toDate(), initialEndDate.toDate()],

      searchTerm: '',
      showFilters: true
    },

    // Modal state
    modal: {
      isOpen: false,
      type: null,
      loading: false,
      selectedVendors: [],
      editData: null,
      deleteData: null
    },

    // Table search state
    tableSearchTerm: ''
  });
  const createParent = useAddParent();
  const editVendorMutation = useEditVendor(state.modal.editData?.id);
  const deleteParentMutation = useDeleteParent(state.modal.editData?.id);
  const assignWards = useAssignWards(state.modal.selectedParentId);
  const { data } = useGetStudentBySchoolId({}, userInfo?.schoolId);

  const {
    data: vendorData,
    loading: isVendorLoading,
    refetch: refetchVendors
  } = useGetParentBySchoolIdd(
    {
      page: state.page,
      limit: state.rowsPerPage,
      search: state.filters.searchTerm || state.tableSearchTerm || '',
      from: convertDateJS(state.filters.dateRange[0]),
      to: convertDateJS(state.filters.dateRange[1])
    },
    userInfo?.schoolId
  );
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

  const handleOpenModal = (type, vendorData = null) => {
    updateModal({
      isOpen: true,
      type,
      selectedVendors: type === 'assign' ? [] : state.modal.selectedVendors,
      editData: type === 'edit' || type === 'delete' ? vendorData : null,
      selectedParentId: type === 'assign' ? vendorData?.id : null
    });
  };

  const handleCloseModal = () => {
    updateModal({
      isOpen: false,
      type: null,
      loading: false,
      selectedVendors: []
    });
  };

  const handleAddParent = async (data) => {
    // const vendorData = {
    //   name: data.name.trim(),
    //   phone: data.contact.trim(),
    //   email: data.email.trim(),
    //   address: data.address.trim()
    // };

    createParent.mutate(data, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Parent registered successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchVendors();
      },
      onError: (err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err?.response?.data?.message || err?.message || 'Failed to register Parent. Please try again.',
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
  const handleAssignWards = async (data) => {
    const assignData = {
      studentIds: data
      //   parentId: state.modal.selectedParentId
    };
    assignWards.mutate(data, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Wards assigned successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchVendors();
      },
      onError: (err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err?.response?.data?.message || err?.message || 'Failed to assign wards. Please try again.',
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

  const handleEditVendor = async (data) => {
    const vendorData = {
      //   id: state.modal.editData.id,
      name: data.name.trim(),
      //   phone: data.contact.trim(),
      email: data.email.trim(),
      address: data.address.trim()
    };

    editVendorMutation.mutate(vendorData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Vendor updated successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchVendors();
        handleCloseModal();
      },
      onError: (err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err?.response?.data?.message || err?.message || 'Failed to update vendor. Please try again.',
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

  const handleDeleteVendor = async () => {
    deleteParentMutation.mutate(null, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Vendor deleted successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        refetchVendors();
        handleCloseModal();
      },
      onError: (err) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err?.response?.data?.message || err?.message || 'Failed to delete vendor. Please try again.',
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

  const handleModalAction = async (data) => {
    updateModal({ loading: true });

    try {
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1500)); // Handle different modal actions
      switch (state.modal.type) {
        case 'assign':
          handleAssignWards(data);
          break;
        case 'add':
          handleAddParent(data);
          break;
        case 'edit':
          handleEditVendor(data);
          break;
        case 'bulk':
        //   console.log('Bulk enrolling vendors:', data);
          break;
        case 'delete':
          handleDeleteVendor();
          break;
      }

      handleCloseModal();
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

  const vendorFilters = vendorData?.content || [];

  return (
    <ThemeProvider>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Manage Parents
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Perform actions for parents in the TEMVO ecosystem
          </Typography>
        </Box>
        <ParentFilters filters={state.filters} onFiltersChange={updateFilters} />
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
              Parents List
            </Typography>
            <Box>
              {/* <Button
                variant="outlined"
                startIcon={<MonitorMobbile size={18} variant="Bold" />}
                sx={{ mr: 1 }}
                disabled
                title="Please use the assign button in the table row to assign wards to a specific parent"
              >
                Assign Wards
              </Button> */}
              <Button
                variant="outlined"
                startIcon={<Refresh size={18} variant="Bold" />}
                sx={{
                  mr: 1
                  //   backgroundColor: 'primary.main',
                  //   '&:hover': {
                  //     backgroundColor: lightBlue[300]
                  //   }
                }}
                onClick={refetchVendors()}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<Add size={18} />}
                onClick={() => handleOpenModal('add')}
                sx={{
                  mr: 1,
                  //   backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: lightBlue[300]
                  }
                }}
              >
                Add Parent
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
                  {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    #
                  </TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Assigned School</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isVendorLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Loading parents...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : vendorFilters.length > 0 ? (
                  vendorFilters?.slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage).map((vendor) => (
                    <TableRow key={vendor.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      {/* <TableCell align="center">{vendor.id}</TableCell> */}
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.address}</TableCell>
                      <TableCell>{vendor.occupation}</TableCell>
                      {/* <TableCell>
                      <POSName assignedPOSDeviceIds={vendor.assignedPOSDeviceIds} />
                    </TableCell> */}
                      <TableCell>
                        <SchoolName schoolId={vendor.schoolId} />
                      </TableCell>
                      <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                      {/* <TableCell>{vendor.assignmentDate}</TableCell> */}{' '}
                      <TableCell align="center">
                        {/* <IconButton size="small" color="primary" onClick={() => handleOpenModal('edit', vendor)}>
                        <Edit2 size={18} />
                      </IconButton> */}
                        <Tooltip title="View Parent">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/parents/${vendor.id}`, { state: { vendor } })}>
                            <Eye size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Assign Wards">
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal('assign', vendor)}>
                            <Additem size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Parent">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenModal('delete', { id: vendor.id, name: vendor.name })}
                          >
                            <Trash size={15} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No parents found matching current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={vendorData?.totalElements || 0}
            rowsPerPage={state.rowsPerPage}
            page={state.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>{' '}
        <VendorActionModal
          open={state.modal.isOpen}
          type={state.modal.type}
          loading={state.modal.loading}
          selectedVendors={state.modal.selectedVendors}
          onClose={handleCloseModal}
          onAction={handleModalAction}
          vendors={data?.content || []}
          onVendorLoading={createParent.isPending}
          editData={state.modal.editData}
        />
      </Container>
    </ThemeProvider>
  );
}
