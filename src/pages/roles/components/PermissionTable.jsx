/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  TextField,
  Button,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Add, Edit2, Trash, Eye, SearchNormal1 } from 'iconsax-react';
import { formatPermissionName, getStatusColor, getStatusLabel } from '../util';

const PermissionTable = ({
  state,
  permissionsData,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewPermission,
  onEditPermission,
  onDeletePermission,
  onViewPermission
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onTableSearchChange(event);
  };

  const permissions = permissionsData?.content || [];
  const totalElements = permissionsData?.totalElements || 0;

  return (
    <>
      {/* Table Header */}
      <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Permissions Management ({totalElements})
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchNormal1 size="20" color={theme.palette.text.secondary} style={{ marginRight: 8 }} />
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onOpenNewPermission}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            New Permission
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Permission Name</TableCell>
              {/* <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Resource</TableCell> */}
              {/* <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Action</TableCell> */}
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Description</TableCell>
              {/* <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Status</TableCell> */}
              {/* <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Created</TableCell> */}
              <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No permissions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow
                  key={permission.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatPermissionName(permission.name)}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Chip label={permission.resource} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                  </TableCell> */}
                  {/* <TableCell>
                    <Chip label={permission.action} size="small" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {permission.description || 'No description'}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Chip
                      label={getStatusLabel(permission.active)}
                      color={getStatusColor(permission.active)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell> */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="View Permission">
                        <IconButton size="small" onClick={() => onViewPermission(permission)} sx={{ color: theme.palette.info.main }}>
                          <Eye size="16" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Permission">
                        <IconButton size="small" onClick={() => onEditPermission(permission)} sx={{ color: theme.palette.primary.main }}>
                          <Edit2 size="16" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Permission">
                        <IconButton size="small" onClick={() => onDeletePermission(permission)} sx={{ color: theme.palette.error.main }}>
                          <Trash size="16" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalElements}
        page={state.permissionPage}
        onPageChange={onPageChange}
        rowsPerPage={state.permissionRowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          '& .MuiTablePagination-toolbar': {
            px: 3
          }
        }}
      />
    </>
  );
};

export default PermissionTable;
