import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

const ReportStats = ({ successfulCount, failedCount }) => {
  return (
    <Card elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              Reports & Analytics
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Generate detailed reports and analyze financial transactions across the system.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" color="success.main">
                  Successful: {successfulCount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="error.main">
                  Failed: {failedCount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReportStats;
