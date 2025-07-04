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
  Skeleton,
  CircularProgress,
  TablePagination
} from '@mui/material';
import {
  Add,
  Additem,
  Check,
  CloseCircle,
  DocumentUpload,
  SearchFavorite1,
  SearchNormal,
  SearchNormal1,
  Setting3,
  TickCircle,
  Trash
} from 'iconsax-react';
import { useGetGeneralSchoolById } from 'api/requests';
import StudentApiKeyCell from 'pages/schools/sections/StudentApiKeyCell';

const rowsPerPageOptions = [10, 20, 50, 100];

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'error';
    case 'REGISTERED':
      return 'info';
    //   return 'warning';
    default:
      return 'default';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// SchoolName component integrated within the file
const SchoolName = ({ schoolId }) => {
  const { data: schoolData, isLoading, error } = useGetGeneralSchoolById(schoolId);

  if (!schoolId) {
    return <Typography variant="body2">N/A</Typography>;
  }

  if (isLoading) {
    return <Skeleton variant="text" width={120} height={20} />;
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Error loading school
      </Typography>
    );
  }

  return <Typography variant="body2">{schoolData?.name || `School ${schoolId}`}</Typography>;
};

const PosTable = ({
  state,
  posData,
  isLoading,
  onTabChange,
  onPageChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewPos,
  onOpenBulkPos,
  onOpenAssignPos,
  onDeletePos,
  onDeactivatePOS,
  onActivatePOS
}) => {
  const filteredPos = useMemo(() => {
    if (!posData?.content) return [];

    let filtered = [...posData.content];

    // Filter by tab value
    if (state.tabValue === 1) {
      // Assigned - has schoolId
      filtered = filtered.filter((w) => w.schoolId && w.status === 'Active');
    } else if (state.tabValue === 2) {
      // Unassigned - no schoolId
      filtered = filtered.filter((w) => !w.schoolId);
    }

    return filtered;
  }, [posData?.content, state.tabValue]);
  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab label="All POS" />
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
        <Typography variant="h6">POS List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" color="primary" startIcon={<Add />} size="small" onClick={() => onOpenNewPos()}>
            Register New POS
          </Button>
          <Button variant="outlined" color="primary" startIcon={<DocumentUpload />} size="small" onClick={() => onOpenBulkPos()}>
            Register Bulk POS
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Additem />} size="small" onClick={() => onOpenAssignPos()}>
            Assign POS
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
                <SearchNormal1 size={15} />
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
              <TableCell>Model</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Assigned At</TableCell>
              {/* <TableCell>Date Assigned</TableCell> */}
              <TableCell>Assigned School</TableCell>
              <TableCell>API Key</TableCell>
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
                    Loading pos devices...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredPos?.length > 0 ? (
              filteredPos?.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.modelNumber}</TableCell>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{formatDate(row.assignedAt)}</TableCell>
                  {/* <TableCell>{row.dateAssigned}</TableCell> */}
                  <TableCell>
                    <SchoolName schoolId={row.schoolId} />{' '}
                  </TableCell>
                  <StudentApiKeyCell student={row} />
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
                    <Tooltip title="Assign POS">
                      <IconButton size="small" color="primary" onClick={() => onOpenAssignPos(row.id)}>
                        <Additem size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deactivate POS">
                      <IconButton size="small" color="warning" onClick={() => onDeactivatePOS(row.id)} disabled={row.status !== 'Active'}>
                        <CloseCircle size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Activate POS">
                      <IconButton size="small" color="info" onClick={() => onActivatePOS(row.id)} disabled={row.status === 'Active'}>
                        <TickCircle size={15} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete POS">
                      <IconButton size="small" color="error" onClick={() => onDeletePos(row.id)}>
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
                    No POS Devices found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          {state.filteredPosDevices.length > 0
            ? `1 to ${Math.min(state.filteredPosDevices.length, state.rowsPerPage)} of ${state.filteredPosDevices.length}`
            : '0'}{' '}
          entries
        </Typography>
      </Box> */}

      <TablePagination
        component="div"
        count={posData?.totalElements || 0}
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

export default PosTable;
