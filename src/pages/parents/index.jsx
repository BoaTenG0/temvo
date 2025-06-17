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
  Tooltip
} from '@mui/material';
import { SearchNormal1, Add, Edit2, Trash, DocumentUpload, MonitorMobbile, Additem } from 'iconsax-react';
import { ThemeProvider } from '../students/components/theme-provider';
// import { VendorActionModal } from '@/components/modals/VendorActionModal';
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
import { POSName } from 'pages/nfc-wristbands/components/getPOSName';
import dayjs from 'dayjs';
import { convertDateJS } from 'utils/hooks';
// import { useSelector } from 'store';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

// Mock data
const vendors = [
  {
    id: '001',
    name: 'Kweku Sampson',
    vendorId: '220GA201004',
    contact: '0244651111',
    status: 'Assigned',
    posId: 'WB-3452199',
    assignmentDate: '17/02/2025',
    email: 'kweku@example.com',
    businessType: 'Food & Beverage'
  },
  {
    id: '002',
    name: 'Kojo Sampson',
    vendorId: '220GA201004',
    contact: '0244651111',
    status: 'Unassigned',
    posId: 'N/A',
    assignmentDate: 'N/A',
    email: 'kojo@example.com',
    businessType: 'Retail'
  },
  {
    id: '003',
    name: 'Ama Johnson',
    vendorId: '220GA201005',
    contact: '0244651112',
    status: 'Assigned',
    posId: 'WB-3452200',
    assignmentDate: '18/02/2025',
    email: 'ama@example.com',
    businessType: 'Food & Beverage'
  },
  {
    id: '004',
    name: 'Kofi Mensah',
    vendorId: '220GA201006',
    contact: '0244651113',
    status: 'Assigned',
    posId: 'WB-3452201',
    assignmentDate: '18/02/2025',
    email: 'kofi@example.com',
    businessType: 'Services'
  },
  {
    id: '005',
    name: 'Abena Owusu',
    vendorId: '220GA201007',
    contact: '0244651114',
    status: 'Unassigned',
    posId: '',
    assignmentDate: '',
    email: 'abena@example.com',
    businessType: 'Retail'
  }
];

export default function VendorManagement() {
  const theme = useTheme();
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
  const assignWards = useAssignWards(userInfo?.id);
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
      createdAtFrom: convertDateJS(state.filters.dateRange[0]),
      createdAtTo: convertDateJS(state.filters.dateRange[1])
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
      editData: type === 'edit' || type === 'delete' ? vendorData : null
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
    console.log('🚀 ~ handleAddVendor ~ data:', data);
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
        // refetchVendors();
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
      studentIds: [data]
    };
    assignWards.mutate(assignData, {
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
        // refetchVendors();
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
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Handle different modal actions
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
          console.log('Bulk enrolling vendors:', data);
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

  // Filter vendors based on selected filters
  //   const filteredVendors = vendors.filter((vendor) => {
  //     const matchesStatus = state.filters.selectedStatus === 'All' || vendor.status === state.filters.selectedStatus;
  //     const matchesBusinessType = state.filters.selectedBusinessType === 'All' || vendor.businessType === state.filters.selectedBusinessType;
  //     const matchesGlobalSearch =
  //       vendor.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
  //       vendor.vendorId.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
  //       vendor.contact.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
  //       vendor.posId.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
  //     const matchesTableSearch =
  //       vendor.name.toLowerCase().includes(state.tableSearchTerm.toLowerCase()) ||
  //       vendor.vendorId.toLowerCase().includes(state.tableSearchTerm.toLowerCase()) ||
  //       vendor.contact.toLowerCase().includes(state.tableSearchTerm.toLowerCase()) ||
  //       vendor.posId.toLowerCase().includes(state.tableSearchTerm.toLowerCase());

  //     return matchesStatus && matchesBusinessType && matchesGlobalSearch && matchesTableSearch;
  //   });

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
              <Button
                variant="outlined"
                startIcon={<MonitorMobbile size={18} variant="Bold" />}
                sx={{ mr: 1 }}
                onClick={() => handleOpenModal('assign')}
              >
                Assign Wards
              </Button>
              <Button variant="outlined" startIcon={<Add size={18} />} sx={{ mr: 1 }} onClick={() => handleOpenModal('add')}>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Occupation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assigned School</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorFilters?.slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage).map((vendor) => (
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
                      <Tooltip title="Assign Wards">
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal('edit', vendor)}>
                          <Additem size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Parent">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenModal('delete', { id: vendor.id, name: vendor.name })}
                        >
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
            count={vendorData?.data?.totalElements || 0}
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
          vendors={vendors}
          onVendorLoading={createParent.isPending}
          editData={state.modal.editData}
        />
      </Container>
    </ThemeProvider>
  );
}
