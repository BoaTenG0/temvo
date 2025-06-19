import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Button,
  Chip,
  Typography,
  Collapse,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Filter, ArrowDown2, ArrowUp2, CloseCircle, Calendar, MoneyRecive, MoneySend } from 'iconsax-react';

const TRANSACTION_TYPES = [
  { value: 'FUND', label: 'Fund' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'WITHDRAW', label: 'Withdraw' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'REFUND', label: 'Refund' }
];

const TRANSACTION_STATUS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

const PROVIDERS = [
  { value: 'MTN', label: 'MTN' },
  { value: 'VODAFONE', label: 'Vodafone' },
  { value: 'AIRTELTIGO', label: 'AirtelTigo' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' }
];

const CHANNELS = [
  { value: 'REDDE', label: 'Redde' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'BANK', label: 'Bank' },
  { value: 'CARD', label: 'Card' }
];

export function TransactionFilters({ filters, onFiltersChange, onClearFilters }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== '' && value !== null && value !== undefined).length;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ pb: expanded ? 3 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 3 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Filter size={20} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
            </Box>
            {hasActiveFilters && <Chip label={`${getActiveFiltersCount()} active`} size="small" color="primary" variant="outlined" />}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasActiveFilters && (
              <Button size="small" onClick={onClearFilters} startIcon={<CloseCircle size={16} />} sx={{ mr: 1 }}>
                Clear All
              </Button>
            )}
            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ArrowUp2 size={20} /> : <ArrowDown2 size={20} />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              {/* Transaction Type */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Transaction Type"
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {TRANSACTION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All Status</MenuItem>
                  {TRANSACTION_STATUS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Provider */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Provider"
                  value={filters.provider || ''}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All Providers</MenuItem>
                  {PROVIDERS.map((provider) => (
                    <MenuItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Channel */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Channel"
                  value={filters.channel || ''}
                  onChange={(e) => handleFilterChange('channel', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All Channels</MenuItem>
                  {CHANNELS.map((channel) => (
                    <MenuItem key={channel.value} value={channel.value}>
                      {channel.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date From */}
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="From Date"
                  value={filters.from ? new Date(filters.from) : null}
                  onChange={(date) => handleFilterChange('from', date ? date.toISOString().split('T')[0] : '')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Calendar size={20} />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              {/* Date To */}
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="To Date"
                  value={filters.to ? new Date(filters.to) : null}
                  onChange={(date) => handleFilterChange('to', date ? date.toISOString().split('T')[0] : '')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Calendar size={20} />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </Grid>

              {/* Amount Min */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={filters.amountMin || ''}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyRecive size={20} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Amount Max */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={filters.amountMax || ''}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneySend size={20} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Collapse>
      </CardContent>
    </Card>
  );
}
