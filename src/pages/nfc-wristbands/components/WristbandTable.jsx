/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tabs,
  Tab,
  Tooltip,
  TablePagination,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { Add, Additem, DocumentUpload, SearchFavorite1, Setting3, Trash } from 'iconsax-react';
import { format } from 'date-fns';
import { SchoolName } from './getSchoolName'; // Adjust the import path as necessary
import { lightBlue } from '@mui/material/colors';
const rowsPerPageOptions = [10, 20, 50, 100];

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'revoked':
      return 'warning';
    default:
      return 'default';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

const WristbandTable = ({
  state,
  wristbandsData,
  isLoading,
  onTabChange,
  onPageChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewWristband,
  onOpenBulkWristband,
  onOpenAssignWristband,
  onDeactivateWristband,
  onDeleteWristband
}) => {
  // Filter wristbands based on tab selection
  const filteredWristbands = useMemo(() => {
    if (!wristbandsData?.content) return [];

    let filtered = [...wristbandsData.content];

    // Filter by tab value
    if (state.tabValue === 1) {
      // Assigned - has schoolId
      filtered = filtered.filter((w) => w.schoolId && w.status === 'active');
    } else if (state.tabValue === 2) {
      // Unassigned - no schoolId
      filtered = filtered.filter((w) => !w.schoolId && w.status === 'active');
    }

    return filtered;
  }, [wristbandsData?.content, state.tabValue]);

  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab label="All Wristbands" />
          <Tab label="Assigned" />
          <Tab label="Unassigned" />
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h6">Wristband List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            size="small"
            onClick={onOpenNewWristband}
            sx={{
            //   backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: lightBlue[300]
              }
            }}
          >
            Register New Wristband
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DocumentUpload />}
            size="small"
            onClick={onOpenBulkWristband}
            sx={{
            //   backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: lightBlue[300]
              }
            }}
          >
            Register Bulk Wristbands
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField select size="small" value={state.rowsPerPage} onChange={onRowsPerPageChange} sx={{ width: 100 }}>
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          placeholder="Search..."
          value={state.tableSearchTerm}
          onChange={(e) => onTableSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchFavorite1 fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ width: { xs: '100%', sm: 250 }, mt: { xs: 2, sm: 0 } }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Model Name</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Date Registered</TableCell>
              {/* <TableCell>Date Assigned</TableCell> */}
              <TableCell>Assigned School</TableCell>
              <TableCell>Status</TableCell>
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
            ) : filteredWristbands.length > 0 ? (
              filteredWristbands.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.model || 'N/A'}</TableCell>
                  <TableCell>{row.modelNumber || 'N/A'}</TableCell>
                  <TableCell>{row.serialNumber || 'N/A'}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>
                    <SchoolName schoolId={row.schoolId} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Assign Wristband">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onOpenAssignWristband(row)}
                        disabled={row.schoolId} // Disable if already assigned
                      >
                        <Additem size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deactivate Wristband">
                      <IconButton size="small" color="warning" onClick={() => onDeactivateWristband(row.id)}>
                        <Setting3 size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Wristband">
                      <IconButton size="small" color="error" onClick={() => onDeleteWristband(row.id)}>
                        <Trash size={15} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No wristbands found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={wristbandsData?.totalElements || 0}
        page={state.page}
        onPageChange={onPageChange}
        rowsPerPage={state.rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
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
    </Card>
  );
};

export default WristbandTable;
