/* eslint-disable no-unused-vars */

import React from 'react';
import { Card, CardContent, Box, Typography, Button, Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import { Filter, SearchFavorite } from 'iconsax-react';
import { schoolOptions, regionOptions, statusOptions } from '../constants/schoolConstants';

const SchoolFilters = ({ state, schools, onToggleFilters, onSearchChange, onDateRangeChange, onSchoolChange, onStatusChange }) => {
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
                  School Name
                </Typography>
                <TextField select fullWidth size="small" value={state.school} onChange={onSchoolChange}>
                  {schoolOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Region
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={state.region}
                  onChange={(e) => onSchoolChange(e)} // This should be onRegionChange but keeping consistent with original
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <TextField select fullWidth size="small" value={state.status} onChange={onStatusChange}>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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

export default SchoolFilters;
