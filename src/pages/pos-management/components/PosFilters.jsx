/* eslint-disable no-unused-vars */

import React from 'react';
import { Box, Card, CardContent, Grid, Typography, TextField, MenuItem, Button, InputAdornment, Stack, Autocomplete } from '@mui/material';
import { DateRangePicker } from 'rsuite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Filter, SearchFavorite, SearchNormal1 } from 'iconsax-react';
import { predefinedRanges } from '../util';
import { schoolOptions, statusOptions } from '../constants/posConstants';

const PosFilters = ({ state, onToggleFilters, onSearchChange, onDateRangeChange, onSchoolChange, onStatusChange, school, status }) => {
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
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
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
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  School Name
                </Typography>

                <Autocomplete
                  fullWidth
                  size="small"
                  options={school}
                  getOptionLabel={(option) => option.name}
                  value={school.find((s) => s.id === state.school) || null}
                  onChange={(_, newValue) => onSchoolChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} placeholder="Select school" />}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <TextField select fullWidth size="small" value={state.status} onChange={(e) => onStatusChange(e.target.value)}>
                  {status?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
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
                  onChange={(e) => onSearchChange(e.target.value)}
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
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PosFilters;
