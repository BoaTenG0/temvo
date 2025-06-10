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
import { People, SearchNormal1, User, Calendar, Profile2User } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetStudentsBySchool } from 'api/requests';

const StudentsSection = ({ schoolId }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: studentsData, isLoading, error } = useGetStudentsBySchool({ page, size, search: searchTerm }, schoolId);
  console.log('🚀 ~ StudentsSection ~ studentsData:', studentsData);

  const students = studentsData?.content || [];
  console.log('🚀 ~ StudentsSection ~ students:', students);

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
        <Alert severity="error">Failed to load students: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <People size="28" color={theme.palette.secondary.main} />
        <Typography variant="h4" fontWeight="600">
          Students
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
                    Total Students
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="secondary.main">
                    {studentsData?.totalElements || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                  <People size="24" color={theme.palette.secondary.main} />
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
                    Active Students
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {students.filter((s) => s.status === 'ACTIVE').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <Profile2User size="24" color={theme.palette.success.main} />
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
          label="Search Students"
          placeholder="Search by name or student code"
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
                <TableCell>Student</TableCell>
                <TableCell>Student Code</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Date Enrolled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                        <Typography variant="body2" fontWeight="600">
                          {getInitials(student.name || 'Student')}
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {student.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {student.studentCode || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.className || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={student.status || 'ACTIVE'} color={student.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.parentName || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size="16" color={theme.palette.action.active} />
                      <Typography variant="body2">{student.createdAt ? formatDate(student.createdAt) : 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={studentsData?.totalElements || 0}
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

export default StudentsSection;
