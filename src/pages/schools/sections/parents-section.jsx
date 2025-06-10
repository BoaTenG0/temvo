
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
import { UserOctagon, SearchNormal1, Call, Sms, Calendar, People } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetParentBySchoolIdd } from 'api/requests';

const ParentsSection = ({ schoolId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: parentsData, isLoading, error } = useGetParentBySchoolIdd({ page, size, search: searchTerm }, schoolId);

  const parents = parentsData?.content || [];

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
        <Alert severity="error">Failed to load parents: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <UserOctagon size="28" color={theme.palette.warning.main} />
        <Typography variant="h4" fontWeight="600">
          Parents
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
                    Total Parents
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="warning.main">
                    {parentsData?.totalElements || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                  <UserOctagon size="24" color={theme.palette.warning.main} />
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
                    Active Parents
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {parents.filter((p) => p.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <People size="24" color={theme.palette.success.main} />
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
                  <UserOctagon size="24" color={theme.palette.info.main} />
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
          label="Search Parents"
          placeholder="Search by name, email, or phone"
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

      {/* Parents Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parent</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Children Count</TableCell>
                <TableCell>Date Registered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parents.map((parent, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                        <Typography variant="body2" fontWeight="600">
                          {getInitials(parent.name || 'Parent')}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {parent.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Parent ID: {parent.id || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Sms size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{parent.email || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Call size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{parent.phone || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={parent.status || 'ACTIVE'} color={parent.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{parent.childrenCount || 0}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{parent.createdAt ? formatDate(parent.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={parentsData?.totalElements || 0}
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

export default ParentsSection;
