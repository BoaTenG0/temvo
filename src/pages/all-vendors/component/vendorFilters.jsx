/* eslint-disable no-unused-vars */
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import { SearchNormal1, FilterSearch, TickCircle, CloseCircle } from 'iconsax-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from 'rsuite';
import { predefinedRanges } from 'pages/nfc-wristbands/util';

const statuses = ['All', 'Assigned', 'Unassigned'];
const businessTypes = ['All', 'Food & Beverage', 'Retail', 'Services', 'Technology', 'Healthcare'];

export function VendorFilters({ filters, onFiltersChange, withPOS, withoutPOS }) {
  const theme = useTheme();

  const handleFilterChange = (field, value) => {
    onFiltersChange({ [field]: value });
  };

  const toggleFiltersVisibility = () => {
    onFiltersChange({ showFilters: !filters.showFilters });
  };

  return (
    <Card elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="h2">
              Filters
            </Typography>
            <IconButton size="small" onClick={toggleFiltersVisibility} sx={{ ml: 1 }}>
              <FilterSearch size={18} />
            </IconButton>
          </Box>
          {/* <Box>
            <Chip
              icon={<TickCircle size={16} variant="Bold" />}
              label={`With POS: ${withPOS}`}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip icon={<CloseCircle size={16} variant="Bold" />} label={`Without POS: ${withoutPOS}`} color="error" variant="outlined" />
          </Box> */}
        </Box>

        {filters.showFilters && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Date Range
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Stack> */}
                <Stack spacing={2}>
                  <DateRangePicker
                    ranges={predefinedRanges}
                    value={filters.dateRange}
                    // onChange={onDateRangeChange}
                    onChange={(date) => handleFilterChange('dateRange', date)}
                    size="lg"
                    placement="auto"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Status
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={filters.selectedStatus}
                onChange={(e) => handleFilterChange('selectedStatus', e.target.value)}
              >
                {statuses.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Business Type
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={filters.selectedBusinessType}
                onChange={(e) => handleFilterChange('selectedBusinessType', e.target.value)}
              >
                {businessTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
            <Grid item xs={12} md={3}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Global Search
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search Keyword"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchNormal1 size={15} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
