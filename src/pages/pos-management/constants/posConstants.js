// Sample data for POS devices
export const initialPosDevices = [
  {
    id: 1,
    modelName: 'Intel-POS-xu1000',
    modelNumber: 'POS-57687901',
    serialNumber: 'tbw-09300018378',
    dateRegistered: '17/02/2025',
    dateAssigned: '17/02/2025',
    assignedSchool: 'Accra Academy',
    status: 'Assigned'
  },
  {
    id: 2,
    modelName: 'POS-xu10026',
    modelNumber: 'POS-576879027',
    serialNumber: 'tbw-09300018348',
    dateRegistered: '17/02/2025',
    dateAssigned: 'N/A',
    assignedSchool: 'N/A',
    status: 'Unassigned'
  }
];

// School options
export const schoolOptions = [
  { value: 'All', label: 'All' },
  { value: 'Accra Academy', label: 'Accra Academy' },
  { value: 'Ghana International School', label: 'Ghana International School' },
  { value: 'Other School', label: 'Other School' }
];

// Status options
export const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'Unassigned', label: 'Unassigned' }
];

// Rows per page options
export const rowsPerPageOptions = [5, 10, 25, 50];

// Modal style
export const modalStyle = {
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

// Initial form states
export const initialNewPos = {
  modelName: '',
  modelNumber: '',
  serialNumber: ''
};

export const initialAssignData = {
  school: 'Accra Academy',
  count: ''
};

// Theme configuration
export const theme = {
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
};
