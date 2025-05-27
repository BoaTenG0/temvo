/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
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
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
  Modal,
  Alert
} from '@mui/material';

import { DateRangePicker } from 'rsuite';
// import { predefinedRanges } from './util';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Add,
  Additem,
  ArchiveTick,
  Building,
  Calendar,
  CloseCircle,
  DocumentUpload,
  Filter,
  InfoCircle,
  SearchFavorite,
  SearchFavorite1,
  Setting3,
  Settings,
  Eye,
  WatchStatus,
  TableDocument,
  Edit
} from 'iconsax-react';
import { format } from 'date-fns';

// Create a custom theme with neutral colors and accent highlights
const theme = createTheme({
  palette: {
    primary: {
      main: '#546e7a' // Neutral blue-gray as primary
    },
    secondary: {
      main: '#26a69a' // Teal as accent color
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#37474f',
      secondary: '#546e7a'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem'
    },
    subtitle1: {
      fontSize: '0.9rem',
      color: '#546e7a'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f7fa'
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6
        }
      }
    }
  }
});

// Sample data
const initialWristbands = [
  {
    id: 1,
    userName: 'Fred',
    email: 'fred@temvo.com',
    phoneNumber: '02445588660',
    role: 'Super Admin',
    assignedSchool: 'N/A',
    status: 'Active'
  },
   {
    id: 2,
    userName: 'Kwame',
    email: 'kwame@school.com',
    phoneNumber: '02445588660',
    role: 'Super Admin',
    assignedSchool: 'Accra Academy',
    status: 'Inactive'
  },
];
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default function WristbandManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [school, setSchool] = useState('All');
  const [status, setStatus] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [wristbands, setWristbands] = useState(initialWristbands);
  const [filteredWristbands, setFilteredWristbands] = useState(initialWristbands);
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [newWristbandOpen, setNewWristbandOpen] = useState(false);
  const [bulkWristbandOpen, setBulkWristbandOpen] = useState(false);
  const [assignWristbandOpen, setAssignWristbandOpen] = useState(false);

  const [newWristband, setNewWristband] = useState({
    modelName: '',
    modelNumber: '',
    serialNumber: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignData, setAssignData] = useState({
    school: 'Accra Academy',
    count: ''
  });
  const assignedCount = wristbands.filter((w) => w.status === 'Assigned').length;
  const unassignedCount = wristbands.filter((w) => w.status === 'Unassigned').length;

  useEffect(() => {
    let filtered = [...wristbands];

    // Filter by tab value
    if (tabValue === 1) {
      filtered = filtered.filter((w) => w.status === 'Assigned');
    } else if (tabValue === 2) {
      filtered = filtered.filter((w) => w.status === 'Unassigned');
    }

    // Filter by school
    if (school !== 'All') {
      filtered = filtered.filter((w) => w.assignedSchool === school);
    }

    // Filter by status
    if (status !== 'All') {
      filtered = filtered.filter((w) => w.status === status);
    }

    // Filter by date range
    // if (dateRange[0] && dateRange[1]) {
    //   const startDate = new Date(dateRange[0]);
    //   const endDate = new Date(dateRange[1]);

    //   filtered = filtered.filter((w) => {
    //     if (w.dateRegistered === 'N/A') return false;
    //     const parts = w.dateRegistered.split('/');
    //     const wristbandDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    //     return wristbandDate >= startDate && wristbandDate <= endDate;
    //   });
    // }

    // Filter by global search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.modelName.toLowerCase().includes(term) ||
          w.modelNumber.toLowerCase().includes(term) ||
          w.serialNumber.toLowerCase().includes(term) ||
          w.assignedSchool.toLowerCase().includes(term) ||
          w.status.toLowerCase().includes(term)
      );
    }

    // Filter by table search
    if (tableSearchTerm) {
      const term = tableSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.modelName.toLowerCase().includes(term) ||
          w.modelNumber.toLowerCase().includes(term) ||
          w.serialNumber.toLowerCase().includes(term) ||
          w.assignedSchool.toLowerCase().includes(term) ||
          w.status.toLowerCase().includes(term)
      );
    }

    setFilteredWristbands(filtered);
  }, [wristbands, tabValue, school, status, dateRange, searchTerm, tableSearchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  // Modal handlers
  const handleOpenNewWristband = () => setNewWristbandOpen(true);
  const handleCloseNewWristband = () => {
    setNewWristbandOpen(false);
    setNewWristband({ modelName: '', modelNumber: '', serialNumber: '' });
  };

  const handleOpenBulkWristband = () => setBulkWristbandOpen(true);
  const handleCloseBulkWristband = () => {
    setBulkWristbandOpen(false);
    setSelectedFile(null);
  };

  const handleOpenAssignWristband = () => setAssignWristbandOpen(true);
  const handleCloseAssignWristband = () => {
    setAssignWristbandOpen(false);
    setAssignData({ school: 'Accra Academy', count: '' });
  };

  // Form handlers
  const handleNewWristbandChange = (e) => {
    const { name, value } = e.target;
    setNewWristband((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAssignDataChange = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterWristband = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const newItem = {
      id: wristbands.length + 1,
      ...newWristband,
      dateRegistered: formattedDate,
      dateAssigned: 'N/A',
      assignedSchool: 'N/A',
      status: 'Unassigned'
    };

    setWristbands((prev) => [...prev, newItem]);
    handleCloseNewWristband();
  };

  const handleBulkRegister = () => {
    // In a real app, this would process the CSV file
    // For demo purposes, we'll just add some dummy data
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const bulkItems = [
      {
        id: wristbands.length + 1,
        modelName: 'Bulk-POS-xu3000',
        modelNumber: 'POS-57687903',
        serialNumber: 'tbw-09300018380',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      },
      {
        id: wristbands.length + 2,
        modelName: 'Bulk-POS-xu3001',
        modelNumber: 'POS-57687904',
        serialNumber: 'tbw-09300018381',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      }
    ];

    setWristbands((prev) => [...prev, ...bulkItems]);
    handleCloseBulkWristband();
  };

  const handleAssignWristbands = () => {
    // In a real app, this would assign wristbands to a school
    // For demo purposes, we'll update the first unassigned wristband
    const count = Number.parseInt(assignData.count, 10);
    if (isNaN(count) || count <= 0) return;

    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const updatedWristbands = [...wristbands];
    let assigned = 0;

    for (let i = 0; i < updatedWristbands.length && assigned < count; i++) {
      if (updatedWristbands[i].status === 'Unassigned') {
        updatedWristbands[i].status = 'Assigned';
        updatedWristbands[i].assignedSchool = assignData.school;
        updatedWristbands[i].dateAssigned = formattedDate;
        assigned++;
      }
    }

    setWristbands(updatedWristbands);
    handleCloseAssignWristband();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Card elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Manage Users
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Manage administrators in the TEMVO Ecosystem
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Chip icon={<ArchiveTick />} label="Active: 1" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
                    <Chip icon={<InfoCircle />} label="Inactive: 1" color="secondary" variant="outlined" sx={{ fontWeight: 500 }} />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Filter sx={{ mr: 1 }} />
                  <Typography variant="h6">Filters</Typography>
                </Box>
                <Button size="small" onClick={toggleFilters} startIcon={filtersExpanded ? null : <Filter />}>
                  {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </Box>

              {filtersExpanded && (
                <Box sx={{ p: 3, pt: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Building fontSize="small" sx={{ mr: 0.5 }} /> */}
                        Role
                      </Typography>
                      <TextField select fullWidth size="small" value={school} onChange={(e) => setSchool(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Super Admin">Super Admin</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <TextField select fullWidth size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Assigned">Active</MenuItem>
                        <MenuItem value="Unassigned">Inactive</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Global Search
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search Keyword"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchFavorite fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 1 }}>
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
                <Button variant="outlined" color="primary" startIcon={<Add />} size="small" onClick={handleOpenNewWristband}>
                  Add New User
                </Button>
                {/* <Button variant="outlined" color="primary" startIcon={<DocumentUpload />} size="small" onClick={handleOpenBulkWristband}>
                  Register Bulk Schools
                </Button> */}
              </Stack>
            </Box>

            <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField select size="small" value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ width: 100 }}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </TextField>
              <TextField
                size="small"
                placeholder="Search..."
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
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number </TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Assigned School</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWristbands.length > 0 ? (
                    filteredWristbands.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.userName}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>{row.assignedSchool}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={row.status === 'Active' ? 'success' : 'warning'}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor: row.status === 'Active' ? 'success.light' : 'warning.light',
                              color: row.status === 'Active' ? 'success.main' : 'warning.main',
                              border: 'none'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary">
                            <Edit fontSize="small" />
                          </IconButton>

                          <IconButton size="small" color="primary">
                            <CloseCircle fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No Users found matching the current filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
              <Typography variant="body2" color="text.secondary">
                Showing{' '}
                {filteredWristbands.length > 0
                  ? `1 to ${Math.min(filteredWristbands.length, rowsPerPage)} of ${filteredWristbands.length}`
                  : '0'}{' '}
                entries
              </Typography>
            </Box>
          </Card>
        </Container>
        {/* Register New Wristband Modal */}
        <Modal open={newWristbandOpen} onClose={handleCloseNewWristband} aria-labelledby="register-new-wristband-modal">
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Register New User
              </Typography>
              <IconButton onClick={handleCloseNewWristband} size="small">
                <CloseCircle fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Register a new user in the TEMVO POS system.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  User Name
                </Typography>
                <TextField
                  fullWidth
                  name="userName"
                  placeholder="Enter User Name"
                  value={newWristband.userName}
                  onChange={handleNewWristbandChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  placeholder="Enter Email"
                  value={newWristband.email}
                  onChange={handleNewWristbandChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={newWristband.phonerNumber}
                  onChange={handleNewWristbandChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Role
                </Typography>
                <TextField
                  fullWidth
                  name="role"
                  placeholder="Enter Role"
                  value={newWristband.role}
                  onChange={handleNewWristbandChange}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Assigned School
                </Typography>
                <TextField
                  fullWidth
                  name="assigneSchool"
                  placeholder="Enter Assigned School"
                  value={newWristband.assignedSchool}
                  onChange={handleNewWristbandChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseNewWristband}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegisterWristband}
                disabled={!newWristband.modelName || !newWristband.modelNumber || !newWristband.serialNumber}
              >
                Register User
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Register Bulk Wristbands Modal */}
        {/* <Modal open={bulkWristbandOpen} onClose={handleCloseBulkWristband} aria-labelledby="register-bulk-wristbands-modal">
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Register Bulk Schoold
              </Typography>
              <IconButton onClick={handleCloseBulkWristband} size="small">
                <CloseCircle fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Register multiple schools in the TEMVO POS system.
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Super Admins can bulk schools via CSV. Download a{' '}
              <Button variant="text" color="primary" size="small" sx={{ p: 0, minWidth: 'auto', fontWeight: 'bold' }}>
                sample file
              </Button>{' '}
              or choose a file to upload.
            </Alert>

            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                display: 'flex',
                overflow: 'hidden',
                mb: 2
              }}
            >
              <Button
                component="label"
                variant="contained"
                sx={{
                  borderRadius: 0,
                  bgcolor: '#f5f5f5',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: '#e0e0e0'
                  }
                }}
              >
                Browse...
                <input type="file" hidden accept=".csv" onChange={handleFileChange} />
              </Button>
              <Box sx={{ p: 2, flexGrow: 1 }}>{selectedFile ? selectedFile.name : 'No file selected.'}</Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseBulkWristband}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleBulkRegister} disabled={!selectedFile}>
                Enroll Bulk POS Devices
              </Button>
            </Box>
          </Box>
        </Modal> */}

        {/* Assign Wristband Modal */}
        {/* <Modal open={assignWristbandOpen} onClose={handleCloseAssignWristband} aria-labelledby="assign-wristband-modal">
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Assign NFC POS
              </Typography>
              <IconButton onClick={handleCloseAssignWristband} size="small">
                <CloseCircle fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Assign NFC POS to a school.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  School Name
                </Typography>
                <TextField select fullWidth name="school" value={assignData.school} onChange={handleAssignDataChange}>
                  <MenuItem value="Accra Academy">Accra Academy</MenuItem>
                  <MenuItem value="Ghana International School">Ghana International School</MenuItem>
                  <MenuItem value="Other School">Other School</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Number of POS Devices
                </Typography>
                <TextField
                  fullWidth
                  name="count"
                  type="number"
                  placeholder="Enter Number of POS Devices"
                  value={assignData.count}
                  onChange={handleAssignDataChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseAssignWristband}>
                Clear
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignWristbands}
                disabled={!assignData.school || !assignData.count}
              >
                Confirm & Issue
              </Button>
            </Box>
          </Box>
        </Modal> */}
      </Box>
    </ThemeProvider>
  );
}
