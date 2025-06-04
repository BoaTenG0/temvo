/* eslint-disable no-unused-vars */

import React from 'react';
import { Card, Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import { tabLabels } from '../constants/reportConstants';

// Import chart components (these would be your existing chart components)
import AllTransactions from 'sections/widget/chart/AllTransactions';
import TemvoToTemvo from 'sections/widget/chart/TemvoToTemvo';
import MomoToTemvo from 'sections/widget/chart/MomoToTemvo';
import BankToTemvo from 'sections/widget/chart/BankToTemvo';

const ReportCharts = ({ state, onTabChange }) => {
  return (
    <Card sx={{ borderRadius: 2, marginTop: 5 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid item xs={12}>
          {state.tabValue === 0 && <AllTransactions />}
          {state.tabValue === 1 && <TemvoToTemvo />}
          {state.tabValue === 2 && <MomoToTemvo />}
          {state.tabValue === 3 && <BankToTemvo />}
        </Grid>
      </Box>
    </Card>
  );
};

export default ReportCharts;
