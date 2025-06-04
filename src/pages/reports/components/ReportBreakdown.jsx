import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import ProductOverview from '../ProductOverview';
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

const ReportBreakdown = () => {
  return (
    <Grid container spacing={2} marginTop={5} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start">
      <Grid item xs={12} md={6}>
        <ProductOverview />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2, marginTop: 5 }}>
          <Stack sx={{ p: 2 }} spacing={1}>
            <Typography variant="h5">Total Transfers Breakdown</Typography>
            <CardContent>
              <Grid item xs={12} md={12} marginTop={2}>
                <MainCard content={false}>
                  <Stack alignItems="center" sx={{ py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                      <Typography>Temvo-To-Temvo</Typography>
                    </Stack>
                    <Typography variant="subtitle1">10+</Typography>
                  </Stack>
                </MainCard>
              </Grid>

              <Grid item xs={12} md={12} marginTop={2}>
                <MainCard content={false}>
                  <Stack alignItems="center" sx={{ py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                      <Typography>Momo-To-Temvo</Typography>
                    </Stack>
                    <Typography variant="subtitle1">10+</Typography>
                  </Stack>
                </MainCard>
              </Grid>

              <Grid item xs={12} md={12} marginTop={2}>
                <MainCard content={false}>
                  <Stack alignItems="center" sx={{ py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Dot size={6} componentDiv sx={{ bgcolor: 'secondary.darker' }} />
                      <Typography>Bank-To-Temvo</Typography>
                    </Stack>
                    <Typography variant="subtitle1">10+</Typography>
                  </Stack>
                </MainCard>
              </Grid>
            </CardContent>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportBreakdown;
