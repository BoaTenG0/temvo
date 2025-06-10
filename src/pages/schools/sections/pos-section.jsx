/* eslint-disable no-unused-vars */
import { useState } from 'react';
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
  CardContent
} from '@mui/material';
import { People, SearchNormal1, User, Calendar, Profile2User, Devices, DeviceMessage } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetPOSForSchool } from 'api/requests';

const PosSection = ({ schoolId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: posData, isLoading, error } = useGetPOSForSchool({ page, size, search: searchTerm }, schoolId);
  console.log('🚀 ~ StudentsSection ~ posData:', posData);

  const students = posData?.content || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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
        <Alert severity="error">Failed to load pos devices: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <People size="28" color={theme.palette.secondary.main} />
        <Typography variant="h4" fontWeight="600">
          POS Devices
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
                    Total Devices
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="secondary.main">
                    {posData?.totalElements || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                  <Devices size="24" color={theme.palette.secondary.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Devices
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {students.filter((s) => s.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <DeviceMessage size="24" color={theme.palette.success.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Page
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="info.main">
                    {page + 1}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <User size="24" color={theme.palette.info.main} />
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
          label="Search Devices"
          placeholder="Search by name or code"
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

      {/* Students Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{fontSize: 12}}>Serial Number</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Model Number</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Registration Code</TableCell>
                <TableCell>Date Assigned</TableCell>
                <TableCell>Date Reassigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {student.serialNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {student.model || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {student.modelNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {student.assignedBy || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {student.apiKey || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={student.status || 'ACTIVE'} color={student.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.schoolId || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.registrationCode || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{student.assignedAt ? formatDate(student.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{student.reassignedAt ? formatDate(student.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={posData?.totalElements || 0}
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
    </Box>
  );
};

export default PosSection;
