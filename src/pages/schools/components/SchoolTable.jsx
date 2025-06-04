/* eslint-disable no-unused-vars */

import React from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { Add, DocumentUpload, SearchFavorite1, Eye, WatchStatus, TableDocument, Edit, CloseCircle, Trash } from 'iconsax-react';
import { rowsPerPageOptions, tabLabels } from '../constants/schoolConstants';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

const SchoolTable = ({
  state,
  schoolsData,
  isLoading,
  onTabChange,
  onPageChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewSchool,
  onOpenBulkSchool,
  onOpenAssignSchool,
  onViewSchool,
  onEditSchool,
  onDeleteSchool
}) => {
  const schools = schoolsData?.content || [];

  return (
    <Card sx={{ borderRadius: 2 }}>
      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box> */}

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
        <Typography variant="h6">Schools List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" color="primary" startIcon={<Add />} size="small" onClick={onOpenNewSchool}>
            Register New School
          </Button>
          <Button variant="outlined" color="primary" startIcon={<DocumentUpload />} size="small" onClick={onOpenBulkSchool}>
            Register Bulk Schools
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
          onChange={onTableSearchChange}
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
              <TableCell>School Name</TableCell>
              <TableCell>School Code</TableCell>
              <TableCell>School Address</TableCell>
              <TableCell>School Admin</TableCell>
              <TableCell>School Admin Contact</TableCell>
              {/* <TableCell>Total Students</TableCell> */}
              {/* <TableCell>No. of POS</TableCell> */}
              {/* <TableCell>No. of Wristbands</TableCell> */}
              {/* <TableCell>Status</TableCell> */}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading schools...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : schools.length > 0 ? (
              schools.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.adminName}</TableCell>
                  <TableCell>{row.adminPhone}</TableCell>
                  {/* <TableCell>{row.wristbands}</TableCell> */}
                  {/* <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === 'Assigned' ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          bgcolor: row.status === 'Assigned' ? 'success.light' : 'warning.light',
                          color: row.status === 'Assigned' ? 'success.main' : 'warning.main',
                          border: 'none'
                        }}
                      />
                    </TableCell> */}
                  <TableCell align="center">
                    <Tooltip title="View School Details">
                      <IconButton size="small" color="info" onClick={() => onViewSchool(row)}>
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete School">
                      <IconButton size="small" color="error" onClick={() => onDeleteSchool(row.id)}>
                        <Trash size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Assigned Wristbands">
                      <IconButton size="small" color="primary">
                        <WatchStatus size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Assigned POS">
                      <IconButton size="small" color="primary">
                        <TableDocument size={18} />
                      </IconButton>
                    </Tooltip>

                    {/* <Tooltip title="Edit School Details">
                        <IconButton size="small" color="primary" onClick={() => onEditSchool(row)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip> */}

                    {/* <Tooltip title="Deactivate School">
                        <IconButton size="small" color="primary" onClick={() => onDeleteSchool(row.id)}>
                          <CloseCircle fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No schools found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={schoolsData?.totalElements || 0}
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

export default SchoolTable;
