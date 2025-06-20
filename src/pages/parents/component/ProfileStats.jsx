import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { People, Building, Scan, Profile2User } from 'iconsax-react';

export function ProfileStats({ parentData }) {
  const theme = useTheme();

  const wards = parentData?.wards || [];

  const stats = [
    {
      label: 'Total Wards',
      value: wards.length,
      icon: People,
      color: 'primary'
    },
    {
      label: 'Schools',
      value: new Set(wards.map((ward) => ward.schoolName).filter(Boolean)).size,
      icon: Building,
      color: 'secondary'
    },
    {
      label: 'Active Wristbands',
      value: wards.filter((ward) => ward.wristband_id).length,
      icon: Scan,
      color: 'success'
    },
    {
      label: 'Parent ID',
      value: parentData?.id ? `#${parentData.id}` : 'N/A',
      icon: Profile2User,
      color: 'info'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: `${stat.color}.50`,
                  mb: 2
                }}
              >
                <stat.icon size={24} color={theme.palette[stat.color].main} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
