/* eslint-disable no-unused-vars */

import React from 'react';
import { Card, CardContent, Grid, TextField, IconButton, Box, Typography, Collapse, useTheme, Autocomplete } from '@mui/material';
import { SearchNormal1, Filter, ArrowDown2, ArrowUp2 } from 'iconsax-react';
import { ROLE_STATUS_OPTIONS, PERMISSION_STATUS_OPTIONS } from '../util';

const RoleFilters = ({ state, onSearchChange, onStatusChange, onToggleFilters }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      <CardContent sx={{ pb: state.filtersExpanded ? 3 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Search & Filters
          </Typography>
          <IconButton onClick={onToggleFilters} size="small">
            {state.filtersExpanded ? <ArrowUp2 /> : <ArrowDown2 />}
          </IconButton>
        </Box>

        <Collapse in={state.filtersExpanded}>
          <Grid container spacing={3}>
            {/* Search Field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search"
                placeholder={
                  state.tabValue === 0 ? 'Search roles by name or description...' : 'Search permissions by name, resource, or action...'
                }
                value={state.tabValue === 0 ? state.searchTerm : state.permissionSearchTerm}
                onChange={onSearchChange}
                InputProps={{
                  startAdornment: <SearchNormal1 size="20" color={theme.palette.text.secondary} style={{ marginRight: 8 }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={state.tabValue === 0 ? ROLE_STATUS_OPTIONS : PERMISSION_STATUS_OPTIONS}
                value={
                  (state.tabValue === 0 ? ROLE_STATUS_OPTIONS : PERMISSION_STATUS_OPTIONS).find(
                    (option) => option.value === (state.tabValue === 0 ? state.status : state.permissionStatus)
                  ) || null
                }
                onChange={(event, newValue) => {
                  const syntheticEvent = {
                    target: { value: newValue?.value || 'All' }
                  };
                  onStatusChange(syntheticEvent);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => <TextField {...params} label="Status" placeholder="Search status..." />}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default RoleFilters;
