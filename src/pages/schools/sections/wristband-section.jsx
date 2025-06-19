/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useDebounce } from 'hooks/useDebounce';
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
  Stack
} from '@mui/material';
import { People, SearchNormal1, User, Calendar, Profile2User, Devices, DeviceMessage, WristClock } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetWristbandsForCurrentSchool } from 'api/requests';
import { SchoolName } from 'pages/nfc-wristbands/components/getSchoolName';
import dayjs from 'dayjs';
import { predefinedRanges } from 'pages/nfc-wristbands/util';
import { DateRangePicker } from 'rsuite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import '../../../assets/datestyle.css';

const WristbandSection = ({ schoolId }) => {
  const initialStartDate = dayjs().subtract(7, 'days');
  const initialEndDate = dayjs();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [dateRange, setDateRange] = useState([initialStartDate.toDate(), initialEndDate.toDate()]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: posData,
    isLoading,
    error
  } = useGetWristbandsForCurrentSchool(schoolId, {
    page,
    size,
    search: debouncedSearchTerm,
    sort: ['desc'],
    from: dateRange[0],
    to: dateRange[1]
  });

  const students = posData?.data?.content || [];

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
        <WristClock size="28" color={theme.palette.secondary.main} />
        <Typography variant="h4" fontWeight="600">
          Wristband Devices
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
                    {posData?.data.totalElements || 0}
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
                    {students.filter((s) => s.status === 'active').length}
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
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            // fullWidth
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
            size="small"
          />
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={2}>
                <DateRangePicker
                  startText="Start"
                  endText="End"
                  ranges={predefinedRanges}
                  value={dateRange}
                  onChange={(newValue) => setDateRange(newValue)}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 1 }}> to </Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
        </Stack>
      </Paper>

      {/* Students Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 12 }}>Serial Number</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Model Number</TableCell>

                <TableCell>Status</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Date Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : students.length > 0 ? (
                students.map((student, index) => (
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
                      <Chip label={student.status || 'ACTIVE'} color={student.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        <SchoolName schoolId={student?.schoolId} />
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Calendar size="16" color={theme.palette.action.active} />
                        <Typography variant="body2">{formatDate(student.createdAt) || 'N/A'}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No wristband found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={posData?.data.totalElements || 0}
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

export default WristbandSection;
