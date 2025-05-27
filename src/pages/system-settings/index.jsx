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
  Autocomplete,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
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
import AllTransactions from 'sections/widget/chart/AllTransactions';
import TemvoToTemvo from 'sections/widget/chart/TemvoToTemvo';
import MomoToTemvo from 'sections/widget/chart/MomoToTemvo';
import BankToTemvo from 'sections/widget/chart/BankToTemvo';

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
                    System Settings
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Configure global settings, security policies, and user permissions.
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Chip icon={<ArchiveTick />} label="Active: 1" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
                    <Chip icon={<InfoCircle />} label="Inactive: 1" color="secondary" variant="outlined" sx={{ fontWeight: 500 }} />
                  </Stack>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, marginTop: 5 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 1 }}>
                <Tab label="Transaction Settings" />
                <Tab label="Security Security" />
                <Tab label="POS Settings" />
                <Tab label="Roles And Permissions" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid item xs={12}>
                {tabValue === 0 && <TransactionsSettings />}
                {tabValue === 1 && <SecuritySettings />}
                {tabValue === 2 && <PosSettings />}
                {tabValue === 3 && <RolesPermissions />}
              </Grid>
            </Box>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

const TransactionsSettings = () => {
  const [newWristband, setNewWristband] = useState({
    transLimit: '',
    transFee: '',
    maxWithdraw: ''
  });
  const handleNewWristbandChange = (e) => {
    const { name, value } = e.target;
    setNewWristband((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
            Daily Transaction Limit
          </Typography>
          <TextField
            fullWidth
            name="transLimit"
            placeholder="Set daily transaction limit"
            value={newWristband.transLimit}
            onChange={handleNewWristbandChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
            Transaction Fee (Percentage)
          </Typography>
          <TextField
            fullWidth
            name="transFee"
            placeholder="Enter transaction fee"
            value={newWristband.transFee}
            onChange={handleNewWristbandChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
            Max Withdrawal Per Transaction (GHS)
          </Typography>
          <TextField
            fullWidth
            name="maxWithdraw"
            placeholder="Enter max withdrawal amount"
            value={newWristband.maxWithdraw}
            onChange={handleNewWristbandChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!newWristband.transLimit || !newWristband.transFee || !newWristband.maxWithdraw}
        >
          Save Changes
        </Button>
      </Box>
    </Grid>
  );
};

const SecuritySettings = () => {
  const [newWristband, setNewWristband] = useState({
    passStrength: '',
    sessionDuration: ''
  });
  const handleNewWristbandChange = (e) => {
    const { name, value } = e.target;
    setNewWristband((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
            Two Factor Authentication (2FA)
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup aria-label="size" defaultValue="small" name="radio-buttons-group" row>
              <FormControlLabel value="small" control={<Radio />} label="Enable" />
              <FormControlLabel value="medium" control={<Radio className="size-medium" />} label="Disable" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
            Password Strength (Characters)
          </Typography>
          <TextField
            fullWidth
            name="passStrength"
            placeholder="Set Required Length"
            value={newWristband.passStrength}
            onChange={handleNewWristbandChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom>
          Session Timeout Duration (Minutes)
          </Typography>
          <TextField
            fullWidth
            name="sessionDuration"
            placeholder="Set Session Timeout Duration "
            value={newWristband.sessionDuration}
            onChange={handleNewWristbandChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </Box>
    </Grid>
  );
};

const PosSettings = () => {
  const [newWristband, setNewWristband] = useState({
    autoSync: ''
  });
  const handleNewWristbandChange = (e) => {
    const { name, value } = e.target;
    setNewWristband((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            POS Auto-Sync Interval (Minutes)
          </Typography>
          <TextField
            fullWidth
            name="autoSync"
            placeholder="Set Auto-Sync Interval"
            value={newWristband.autoSync}
            onChange={handleNewWristbandChange}
          />
        </Grid>
        
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </Box>
    </Grid>
  );
};

const RolesPermissions = () => {
  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            Allow Super Admin to Modify Roles
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup aria-label="size" defaultValue="small" name="radio-buttons-group" row>
              <FormControlLabel value="small" control={<Radio />} label="Enable" />
              <FormControlLabel value="medium" control={<Radio className="size-medium" />} label="Disable" />
            </RadioGroup>
          </FormControl>
        </Grid>

       <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>
            Limit School Admin to Assigned Schools
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup aria-label="size" defaultValue="small" name="radio-buttons-group" row>
              <FormControlLabel value="small" control={<Radio />} label="Enable" />
              <FormControlLabel value="medium" control={<Radio className="size-medium" />} label="Disable" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"        >
          Save Changes
        </Button>
      </Box>
    </Grid>
  );
};
