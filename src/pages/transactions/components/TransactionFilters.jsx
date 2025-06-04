import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Stack
} from '@mui/material';
import { DateRangePicker } from 'rsuite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Filter, SearchFavorite } from 'iconsax-react';
import { predefinedRanges } from '../util';

const TransactionFilters = ({
  state,
  onToggleFilters,
  onSearchChange,
  onDateRangeChange,
  onSchoolChange,
  onStatusChange
}) => {
  return (
    <Card sx={{ mb: 4, borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Filter sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Button size="small" onClick={onToggleFilters} startIcon={state.filtersExpanded ? null : <Filter />}>
            {state.filtersExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {state.filtersExpanded && (
          <Box sx={{ p: 3, pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Date Range
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={2}>
                    <DateRangePicker
                      ranges={predefinedRanges}
                      value={state.dateRange}
                      onChange={onDateRangeChange}
                      size="lg"
                      placement="auto"
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  School Name
                </Typography>
                <TextField 
                  select 
                  fullWidth 
                  size="small" 
                  value={state.school} 
                  onChange={onSchoolChange}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Accra Academy">Accra Academy</MenuItem>
                  <MenuItem value="Other School">Other School</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <TextField 
                  select 
                  fullWidth 
                  size="small" 
                  value={state.status} 
                  onChange={onStatusChange}
                >
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
                  value={state.searchTerm}
                  onChange={onSearchChange}
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
  );
};

export default TransactionFilters;
