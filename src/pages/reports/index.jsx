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
  Alert,
  CardHeader
} from '@mui/material';

import { DateRangePicker } from 'rsuite';
import { predefinedRanges } from './util';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Add,
  Additem,
  ArchiveTick,
  ArrowDown,
  ArrowUp,
  Building,
  Calendar,
  CloseCircle,
  DocumentUpload,
  DollarSquare,
  Fatrows,
  Filter,
  InfoCircle,
  PasswordCheck,
  SearchFavorite,
  SearchFavorite1,
  Setting3,
  Settings,
  User
} from 'iconsax-react';
import { format } from 'date-fns';
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import AllTransactions from 'sections/widget/chart/AllTransactions';
import BankToBank from 'sections/widget/chart/TemvoToTemvo';
import BankToTemvo from 'sections/widget/chart/BankToTemvo';
import MomoToTemvo from 'sections/widget/chart/MomoToTemvo';
import TemvoToTemvo from 'sections/widget/chart/TemvoToTemvo';
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import ProductOverview from './ProductOverview';
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

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
    type: 'Temvo-to-Temvo',
    school: 'Accra Academy',
    Amount: '20,000',
    dbid: '1718290',
    crid: '187303',
    date: '17/02/2025',
    status: 'Successful'
  },
  {
    id: 1,
    type: 'Temvo-to-Temvo',
    school: 'Accra Academy',
    Amount: '20,000',
    dbid: '1718290',
    crid: '187303',
    date: '17/02/2025',
    status: 'Failed'
  }
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
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      filtered = filtered.filter((w) => {
        if (w.dateRegistered === 'N/A') return false;
        const parts = w.dateRegistered.split('/');
        const wristbandDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return wristbandDate >= startDate && wristbandDate <= endDate;
      });
    }

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
                    Reports & Analytics
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Generate detailed reports and analyze financial transactions across the system.{' '}
                  </Typography>
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
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Calendar fontSize="small" sx={{ mr: 0.5 }} /> */}
                        Date Range
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={2}>
                          <DateRangePicker
                            ranges={predefinedRanges}
                            value={dateRange}
                            onChange={(newValue) => setDateRange(newValue)}
                            size="lg"
                            placement="auto"
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Building fontSize="small" sx={{ mr: 0.5 }} /> */}
                        School Name
                      </Typography>
                      <TextField select fullWidth size="small" value={school} onChange={(e) => setSchool(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Accra Academy">Accra Academy</MenuItem>
                        <MenuItem value="Other School">Other School</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <TextField select fullWidth size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Successful">Successful</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
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

          <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Total Schools"
                count="3000"
                iconPrimary={<Fatrows />}
                percentage={
                  <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.primary.main} />
              </EcommerceDataCard>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Total Students"
                count="290+"
                color="warning"
                iconPrimary={<User color={theme.palette.warning.dark} />}
                percentage={
                  <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.warning.dark} />
              </EcommerceDataCard>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <EcommerceDataCard
                title="Total Successful Transactions (GHC)"
                count="1,568"
                color="success"
                iconPrimary={<DollarSquare color={theme.palette.success.darker} />}
                percentage={
                  <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
                  </Typography>
                }
              >
                <EcommerceDataChart color={theme.palette.success.darker} />
              </EcommerceDataCard>
            </Grid>
          </Grid>

          <Card sx={{ borderRadius: 2, marginTop: 5 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 1 }}>
                <Tab label="All" />
                <Tab label="Temvo-to-Temvo" />
                <Tab label="Momo-to-Temvo" />
                <Tab label="Bank-to-Temvo" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid item xs={12}>
                {tabValue === 0 && <AllTransactions />}
                {tabValue === 1 && <TemvoToTemvo />}
                {tabValue === 2 && <MomoToTemvo />}
                {tabValue === 3 && <BankToTemvo />}
              </Grid>
            </Box>
          </Card>

          <Grid container spacing={2} marginTop={5} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" >
            <Grid item xs={12} md={6}>
              <ProductOverview />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, marginTop: 5 }}>
                <Stack sx={{ p: 2 }} spacing={1}>
                  <Typography variant="h5">Total Transfers Breakdown</Typography>
                  <CardContent>
                    <Grid item xs={12} md={12} marginTop={2}>
                      <MainCard content={false}>
                        <Stack alignItems="center" sx={{ py: 1.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                            <Typography>Temvo-To-Temvo</Typography>
                          </Stack>
                          <Typography variant="subtitle1">10+</Typography>
                        </Stack>
                      </MainCard>
                    </Grid>

                    <Grid item xs={12} md={12} marginTop={2}>
                      <MainCard content={false}>
                        <Stack alignItems="center" sx={{ py: 1.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                            <Typography>Momo-To-Temvo</Typography>
                          </Stack>
                          <Typography variant="subtitle1">10+</Typography>
                        </Stack>
                      </MainCard>
                    </Grid>

                    <Grid item xs={12} md={12} marginTop={2}>
                      <MainCard content={false}>
                        <Stack alignItems="center" sx={{ py: 1.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                            <Typography>Bank-To-Temvo</Typography>
                          </Stack>
                          <Typography variant="subtitle1">10+</Typography>
                        </Stack>
                      </MainCard>
                    </Grid>
                  </CardContent>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
