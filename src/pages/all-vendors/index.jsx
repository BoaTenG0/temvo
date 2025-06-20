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
import { SearchNormal1, Add, Edit2, Trash, DocumentUpload, MonitorMobbile, Additem, Refresh } from 'iconsax-react';
import { ThemeProvider } from '../students/components/theme-provider';
// import { VendorActionModal } from '@/components/modals/VendorActionModal';
import { VendorFilters } from './component/vendorFilters';
import { VendorActionModal } from './component/modals/vendorActionModal';
import {
  useAssignPOStoVendor,
  useBulkUploadVendors,
  useCreateVendor,
  useDeleteVendor,
  useEditVendor,
  useGetPOS,
  useGetAllVendors
} from 'api/requests';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { SchoolName } from 'pages/nfc-wristbands/components/getSchoolName';
import { POSName } from 'pages/nfc-wristbands/components/getPOSName';
import dayjs from 'dayjs';
// import { convertDateJS } from 'utils/hooks';
import { lightBlue } from '@mui/material/colors';
// import { useSelector } from 'store';

function convertDateJS(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

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
  const createVendorMutation = useCreateVendor();
  const editVendorMutation = useEditVendor(state.modal.editData?.id);
  const deleteVendorMutation = useDeleteVendor(state.modal.editData?.id);
  const assignVendor = useAssignPOStoVendor();
  const bulkUploadMutation = useBulkUploadVendors();

  const { data: pos } = useGetPOS({});

  const posData = pos?.data?.content || [];

  const {
    data: vendorData,
    loading: isVendorLoading,
    refetch: refetchVendors
  } = useGetAllVendors({
    page: state.page,
    size: state.rowsPerPage,
    search: state.filters.searchTerm || state.tableSearchTerm || '',
    sortDirection: ['desc'],
    from: convertDateJS(state.filters.dateRange[0]),
    to: convertDateJS(state.filters.dateRange[1])
  });
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
      selectedVendors: type === 'assign' ? (vendorData ? [vendorData.id] : []) : state.modal.selectedVendors,
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

  const handleAddVendor = async (data) => {
    const vendorData = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      address: data.address.trim()
    };

    createVendorMutation.mutate(vendorData, {
      onSuccess: () => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Vendor registered successfully',
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
            message: err?.response?.data?.message || err?.message || 'Failed to register vendor. Please try again.',
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
  const handleAssignVendor = async (vendorId, posId) => {
    if (!vendorId || vendorId.length === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select at a vendor to assign a pos device to.',
          variant: 'alert',
          alert: {
            color: 'warning'
          },
          close: true
        })
      );
      return;
    }
    assignVendor.mutate(
      {
        vendorId,
        posId
      },
      {
        onSuccess: (response) => {
          dispatch(
            openSnackbar({
              open: true,
              message: response.message || 'Vendor assigned successfully',
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
              message: err?.response?.data?.message || err?.message || 'Failed to assign vendor. Please try again.',
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
    deleteVendorMutation.mutate(null, {
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

  const handleBulkUpload = async (file) => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    bulkUploadMutation.mutate(formData, {
      onSuccess: (response) => {
        dispatch(
          openSnackbar({
            open: true,
            message: response.message || 'Vendor registered successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        handleCloseModal();
        refetchVendors();
      },
      onError: (error) => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Error uploading vendors: ' + error.message,
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

    const vendorId = state.modal.selectedVendors[0];
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Handle different modal actions
      switch (state.modal.type) {
        case 'assign':
          handleAssignVendor(vendorId, data.posId);
          break;
        case 'add':
          handleAddVendor(data);
          break;
        case 'edit':
          handleEditVendor(data);
          break;
        case 'bulk':
          handleBulkUpload(data.file);
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

  // Count vendors with and without POS
  const withPOS = vendors.filter((vendor) => vendor.status === 'Assigned').length;
  const withoutPOS = vendors.filter((vendor) => vendor.status === 'Unassigned').length;

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

  const vendorFilters = vendorData?.data?.content || [];

  return (
    <ThemeProvider>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Manage Vendors
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Perform actions for vendors in the TEMVO ecosystem
          </Typography>
        </Box>
        <VendorFilters filters={state.filters} onFiltersChange={updateFilters} withPOS={withPOS} withoutPOS={withoutPOS} />
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
              Vendors List
            </Typography>
            <Box>
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
              {/* <Button
                variant="outlined"
                startIcon={<MonitorMobbile size={18} variant="Bold" />}
                sx={{ mr: 1 }}
                onClick={() => handleOpenModal('assign')}
              >
                Assign POS
              </Button> */}
              <Button
                variant="outlined"
                startIcon={<Add size={18} />}
                onClick={() => handleOpenModal('add')}
                sx={{
                  mr: 1
                  //   backgroundColor: 'primary.main',
                  //   '&:hover': {
                  //     backgroundColor: lightBlue[300]
                  //   }
                }}
              >
                Add Vendor
              </Button>
              <Button
                variant="contained"
                startIcon={<DocumentUpload size={18} />}
                onClick={() => handleOpenModal('bulk')}
                sx={{
                  //   backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: lightBlue[300]
                  }
                }}
              >
                Add Bulk Vendors
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
                  <TableCell>Address</TableCell>
                  {/* <TableCell >STATUS</TableCell> */}
                  <TableCell>POS</TableCell>
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
                        Loading vendors...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : vendorData?.data?.content?.length > 0 ? (
                  vendorFilters?.map((vendor) => (
                    <TableRow key={vendor.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      {/* <TableCell align="center">{vendor.id}</TableCell> */}
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.address}</TableCell>
                      {/* <TableCell>
                      <Chip
                        label={vendor.status}
                        size="small"
                        color={vendor.status === 'Assigned' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell> */}
                      <TableCell>
                        <POSName assignedPOSDeviceIds={vendor.assignedPOSDeviceIds} />
                      </TableCell>
                      <TableCell>
                        <SchoolName schoolId={vendor.schoolId} />
                      </TableCell>
                      <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                      {/* <TableCell>{vendor.assignmentDate}</TableCell> */}{' '}
                      <TableCell align="center">
                        <Tooltip title="Assign POS">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenModal('assign', vendor)}
                            //   disabled={vendor.assignedPOSDeviceIds}
                          >
                            <Additem size={15} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal('edit', vendor)}>
                            <Edit2 size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
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
                        No vendors found
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
          onVendorLoading={createVendorMutation.isPending}
          editData={state.modal.editData}
          posData={posData}
          onAssign={assignVendor?.isPending}
        />
      </Container>
    </ThemeProvider>
  );
}
