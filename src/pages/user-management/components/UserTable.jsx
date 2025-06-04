/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
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
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Add, SearchFavorite1, Edit, CloseCircle, Trash, Eye } from 'iconsax-react';

const UserTable = ({
  state,
  usersData,
  isLoading,
  onTabChange,
  onTableSearchChange,
  onOpenNewUser,
  onEditUser,
  onDeleteUser,
  onViewUser
}) => {
  const users = usersData?.content || [];
  const filteredUsers = useMemo(() => {
    if (!usersData?.content) return [];

    let filtered = [...usersData.content];

    // Filter by tab value
    if (state.tabValue === 1) {
      filtered = filtered.filter((w) => w.active === true);
    } else if (state.tabValue === 2) {
      filtered = filtered.filter((w) => w.active === false);
    }

    return filtered;
  }, [usersData?.content, state.tabValue]);

  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab label="All Users" />
          <Tab label="Active" />
          <Tab label="Inactive" />
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
        <Typography variant="h6">Users List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" color="primary" startIcon={<Add />} size="small" onClick={onOpenNewUser}>
            Add New User
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField select size="small" value={state.rowsPerPage} sx={{ width: 100 }}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
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
              <TableCell width={120}>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Phone Verified</TableCell>
              <TableCell>Email Verified</TableCell>
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
                    Loading users...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                  <TableCell>{row.email || 'N/A'}</TableCell>
                  <TableCell>{row.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.userType}
                      color={row.userType === 'SUPER_ADMIN' ? 'success' : 'secondary'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.isPhoneVerified ? 'Yes' : 'No'}
                      color={row.isPhoneVerified ? 'success' : 'secondary'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.isEmailVerified ? 'Yes' : 'No'}
                      color={row.isEmailVerified ? 'success' : 'secondary'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.active ? 'Active' : 'Inactive'}
                      color={row.active ? 'success' : 'secondary'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View User">
                      <IconButton size="small" color="info" onClick={() => onViewUser(row)}>
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton size="small" color="primary" onClick={() => onEditUser(row)}>
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Wristband">
                      <IconButton size="small" color="error" onClick={() => onDeleteUser(row)}>
                        <Trash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {users.length > 0 ? `1 to ${Math.min(users.length, state.rowsPerPage)} of ${users.length}` : '0'} entries
        </Typography>
      </Box>
    </Card>
  );
};

export default UserTable;
