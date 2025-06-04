import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip
} from '@mui/material';
import { ArchiveTick, InfoCircle } from 'iconsax-react';

const SchoolStats = ({ assignedCount, unassignedCount }) => {
  return (
    <Card elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              Manage Schools
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Issue, reassign, and deactivate NFC wristbands and POS Devices for Schools.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Chip 
                icon={<ArchiveTick />} 
                label={`Active: ${assignedCount}`} 
                color="primary" 
                variant="outlined" 
                sx={{ fontWeight: 500 }} 
              />
              <Chip 
                icon={<InfoCircle />} 
                label={`Inactive: ${unassignedCount}`} 
                color="secondary" 
                variant="outlined" 
                sx={{ fontWeight: 500 }} 
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SchoolStats;
