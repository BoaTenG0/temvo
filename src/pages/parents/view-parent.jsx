import { ThemeProvider, createTheme, CssBaseline, Box, Alert, AlertTitle } from '@mui/material';
import { ParentProfileHeader } from './component/ParentProfileHeader';
import { ProfileStats } from './component/ProfileStats';
import { useLocation } from 'react-router-dom';
import { WardsSection } from './component/WardsSection';
import ClientCTA from "components/cards/CTA";

// Modern neutral theme with subtle accents
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      50: '#eff6ff'
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      50: '#f8fafc'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      50: '#ecfdf5'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      50: '#fffbeb'
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      50: '#eff6ff'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      50: '#fef2f2'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    body1: {
      lineHeight: 1.6
    },
    body2: {
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8
        }
      }
    }
  }
});

// Sample parent data with wards
const sampleParentData = {
  id: 14,
  name: 'azaa Hurley',
  phone: 'Commodo',
  email: 'cawuhu@mailinator.com',
  occupation: 'Explicabo Et beatae',
  address: 'Esse delectus',
  schoolId: 2,
  emergencyContactName: 'Piper Brooks',
  emergencyContactPhone: '+1 (147) 374-9693',
  createdAt: '2025-06-15T09:53:54.804296',
  wards: [
    {
      id: 5,
      name: 'Bobby Johnson',
      schoolName: 'Oti Boateng Senior High School',
      class_name: 'Form 1',
      wristband_id: 13,
      walletId: null,
      schoolId: 2,
      user_id: 30
    }
  ]
};

export default function ParentProfile() {
  const location = useLocation();

  // Get parent data from router state, fallback to sample data for demo
  const parentData = location.state?.vendor || sampleParentData;



  // Show error if no parent data is provided and no sample data
  if (!parentData) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <AlertTitle>Missing Parent Data</AlertTitle>
            No parent data was provided. Please navigate to this page with the required parent information in the router state.
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
            maxWidth: '1200px',
            mx: 'auto'
          }}
        >
          <Box sx={{ flexShrink: 0, mb: 4 }}>
            <ClientCTA title="" user={parentData?.name || "N/A"} />
          </Box>
          {/* Profile Stats */}
          <Box sx={{ mb: 4 }}>
            <ProfileStats parentData={parentData} />
          </Box>

          {/* Parent Profile Header */}
          <Box sx={{ mb: 4 }}>
            <ParentProfileHeader parentData={parentData} />
          </Box>

          {/* Wards Section */}
          <Box sx={{ mb: 4 }}>
            <WardsSection wards={parentData?.wards || []} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
