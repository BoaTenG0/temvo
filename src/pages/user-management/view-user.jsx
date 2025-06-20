import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { WalletCard } from './components/WalletCard';
import { TransactionHistory } from './components/TransactionHistory';
import { useGetUserWalletTransactions, useGetWalletByUserId } from 'api/requests';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ClientCTA from 'components/cards/CTA';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8'
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569'
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

export default function UserProfile() {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    from: '',
    to: '',
    amountMin: '',
    amountMax: '',
    provider: '',
    channel: ''
  });

  // Build query parameters including filters
  const buildQueryParams = () => {
    const params = {
      page: page,
      size: rowsPerPage,
      search: search || '',
      sort: ['desc']
    };

    // Add filters to query params if they have values
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== '') {
        params[key] = filters[key];
      }
    });

    return params;
  };

  const { data: transactions, isLoading, refetch } = useGetUserWalletTransactions(buildQueryParams(), id);

  const { data: wallets } = useGetWalletByUserId(id);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      from: '',
      to: '',
      amountMin: '',
      amountMax: '',
      provider: '',
      channel: ''
    });
    setSearch('');
    setPage(0);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(0); // Reset to first page when search changes
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    refetch();
  };

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
            <ClientCTA title="" user={'User Transaction Details'} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <WalletCard wallet={wallets || {}} />
          </Box>

          <TransactionHistory
            transactions={transactions}
            isLoading={isLoading}
            filters={filters}
            search={search}
            page={page}
            rowsPerPage={rowsPerPage}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRefresh={handleRefresh}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
