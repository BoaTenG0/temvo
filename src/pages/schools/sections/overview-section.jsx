import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Building4, User, Sms, Call, Location, Calendar, People, MoneyRecive, UserOctagon, Shop, Devices } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import {
  useGetStudentsBySchool,
  useGetParentBySchoolIdd,
  useGetAllVendorsBySchool,
  useGetAllTransactionBySchool,
  useGetPOSForSchool
} from 'api/requests';

const OverviewSection = ({ schoolData }) => {
  const theme = useTheme();

  // Fetch summary data for overview cards
  const { data: schoolStudents } = useGetStudentsBySchool({}, schoolData?.id);
  const { data: schoolParents } = useGetParentBySchoolIdd({}, schoolData?.id);
  const { data: schoolVendors } = useGetAllVendorsBySchool({}, schoolData?.id);
  const { data: schoolTransactions } = useGetAllTransactionBySchool({}, schoolData?.id);
  const { data: schoolPos } = useGetPOSForSchool({}, schoolData?.id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const overviewStats = [
    {
      title: 'Total Students',
      value: schoolStudents?.totalElements || 0,
      icon: People,
      color: 'primary'
    },
    {
      title: 'Total Parents',
      value: schoolParents?.totalElements || 0,
      icon: UserOctagon,
      color: 'secondary'
    },
    {
      title: 'Total Vendors',
      value: schoolVendors?.totalElements || 0,
      icon: Shop,
      color: 'info'
    },
    {
      title: 'Total Transactions',
      value: schoolTransactions?.totalElements || 0,
      icon: MoneyRecive,
      color: 'success'
    },
    {
      title: 'Total POS Devices',
      value: schoolPos?.totalElements || 0,
      icon: Devices,
      color: 'error'
    }
  ];

  return (
    <Box>
      {/* School Information Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 64, height: 64 }}>
            <Building4 size="32" color="white" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="600" color="text.primary">
              {schoolData?.name}
            </Typography>
            <Chip label={`Code: ${schoolData?.code}`} variant="outlined" color="primary" size="small" sx={{ mt: 1 }} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <User size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Administrator
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {schoolData?.adminName}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Location size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{schoolData?.address}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Sms size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{schoolData?.adminEmail}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Call size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{schoolData?.adminPhone}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Calendar size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">{formatDate(schoolData?.createdAt)}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Calendar size="20" color={theme.palette.action.active} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">{formatDate(schoolData?.updatedAt)}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Overview Statistics */}
      <Typography variant="h5" fontWeight="600" mb={3}>
        Quick Overview
      </Typography>

      <Grid container spacing={3}>
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="600" color={`${stat.color}.main`}>
                        {stat.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: theme.palette[stat.color].light }}>
                      <Icon size="24" color={theme.palette[stat.color].main} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default OverviewSection;
