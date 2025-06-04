import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { SecuritySafe, Key, TickCircle } from 'iconsax-react';

const RoleStats = ({ rolesCount = 0, permissionsCount = 0, activeRolesCount = 0 }) => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Total Roles',
      value: rolesCount,
      icon: SecuritySafe,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light + '20'
    },
    {
      title: 'Total Permissions',
      value: permissionsCount,
      icon: Key,
      color: theme.palette.secondary.main,
      bgColor: theme.palette.secondary.light + '20'
    },
    {
      title: 'Active Roles',
      value: activeRolesCount,
      icon: TickCircle,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + '20'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${stat.bgColor} 0%, ${stat.bgColor}80 100%)`,
                border: `1px solid ${stat.color}30`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: stat.color,
                        mb: 1,
                        fontSize: { xs: '1.75rem', sm: '2rem' }
                      }}
                    >
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: stat.color + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComponent
                      sx={{
                        fontSize: '2rem',
                        color: stat.color
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RoleStats;
