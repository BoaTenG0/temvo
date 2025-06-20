/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
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
  IconButton
} from '@mui/material';
import { Shop, SearchNormal1, Call, Sms, Calendar, Location, MoneyRecive, Edit2 } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetAllVendorsBySchool, useEditVendor } from 'api/requests';
import { VendorActionModal } from 'pages/vendors/component/modals';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { POSName } from 'pages/nfc-wristbands/components/getPOSName';

const VendorsSection = ({ schoolId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const { data: vendorsData, isLoading, error } = useGetAllVendorsBySchool({ page, size, search: searchTerm }, schoolId);

  const vendors = vendorsData?.data?.content || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedVendor(null);
  };

  const editVendorMutation = useEditVendor(selectedVendor?.id);

  const handleUpdateVendor = async (updatedData) => {
    editVendorMutation.mutate(updatedData, {
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
        handleCloseEditModal();
      },
      onError: (error) => {
        dispatch(
          openSnackbar({
            open: true,
            message: error.message || 'Failed to update vendor',
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
        <Alert severity="error">Failed to load vendors: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Shop size="28" color={theme.palette.info.main} />
        <Typography variant="h4" fontWeight="600">
          Vendors
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
                    Total Vendors
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="info.main">
                    {vendorsData?.data?.totalElements || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <Shop size="24" color={theme.palette.info.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Vendors
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {vendors.filter((v) => v.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <Shop size="24" color={theme.palette.success.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Page
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="primary.main">
                    {page}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                  <Shop size="24" color={theme.palette.primary.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          label="Search Vendors"
          placeholder="Search by name, email, or business type"
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
      </Paper>

      {/* Vendors Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                {/* <TableCell>Business Type</TableCell> */}
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell>POS</TableCell>
                {/* <TableCell>Total Sales</TableCell> */}
                <TableCell>Created Date</TableCell>
                {/* <TableCell align="center">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                        <Typography variant="body2" fontWeight="600">
                          {getInitials(vendor.name || 'Vendor')}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {vendor.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Vendor ID: {vendor.id || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="body2">{vendor.businessType || 'N/A'}</Typography>
                  </TableCell> */}
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Sms size="14" color={theme.palette.action.active} />
                        <Typography variant="caption">{vendor.email || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Call size="14" color={theme.palette.action.active} />
                        <Typography variant="caption">{vendor.phone || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Location size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{vendor.address || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                    <Chip label={vendor.status || 'ACTIVE'} color={vendor.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                  </TableCell> */}
                  {/* <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MoneyRecive size="16" color={theme.palette.action.active} />
                      <Typography variant="body2" fontWeight="500">
                        {formatCurrency(vendor.totalSales)}
                      </Typography>
                    </Box>
                  </TableCell> */}
                  <TableCell>
                    <POSName assignedPOSDeviceIds={vendor.assignedPOSDeviceIds} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{vendor.createdAt ? formatDate(vendor.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  {/* <TableCell align="center">
                    <IconButton onClick={() => handleEditVendor(vendor)} title="Edit Vendor" size="small" color="primary">
                      <Edit2 />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={vendorsData?.data?.totalElements || 0}
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

      {/* Edit Vendor Modal */}
      <VendorActionModal
        open={editModalOpen}
        type="edit"
        onClose={handleCloseEditModal}
        onAction={handleUpdateVendor}
        editData={selectedVendor}
      />
    </Box>
  );
};

VendorsSection.propTypes = {
  schoolId: PropTypes.string
};

export default VendorsSection;
