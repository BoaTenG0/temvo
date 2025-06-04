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
import { formatRoleName, getStatusColor, getStatusLabel } from '../util';

const RoleTable = ({
  state,
  rolesData,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewRole,
  onEditRole,
  onDeleteRole,
  onViewRole
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onTableSearchChange(event);
  };

  const roles = rolesData?.content || [];
  const totalElements = rolesData?.totalElements || 0;

  return (
    <>
      {/* Table Header */}
      <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Roles Management ({totalElements})
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search roles..."
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
            onClick={onOpenNewRole}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            New Role
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Permissions</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Created</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No roles found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatRoleName(role.name)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.permissions?.length || 0} permissions
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(role.active)} color={getStatusColor(role.active)} size="small" sx={{ fontWeight: 500 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="View Role">
                        <IconButton size="small" onClick={() => onViewRole(role)} sx={{ color: theme.palette.info.main }}>
                          <Eye size="16" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Role">
                        <IconButton size="small" onClick={() => onEditRole(role)} sx={{ color: theme.palette.primary.main }}>
                          <Edit2 size="16" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Role">
                        <IconButton size="small" onClick={() => onDeleteRole(role)} sx={{ color: theme.palette.error.main }}>
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
        page={state.page}
        onPageChange={onPageChange}
        rowsPerPage={state.rowsPerPage}
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

export default RoleTable;
