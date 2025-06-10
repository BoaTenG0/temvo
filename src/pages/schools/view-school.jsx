'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Stack
} from '@mui/material';
import { Building4, People, MoneyRecive, UserOctagon, Shop, Menu as MenuIcon, CloseSquare, DeviceMessage } from 'iconsax-react';
import { useParams } from 'react-router-dom';
import { useGetGeneralSchoolById } from 'api/requests';
import ClientCTA from 'components/cards/CTA';

// Import section components
import OverviewSection from './sections/overview-section';
import StudentsSection from './sections/students-section';
import TransactionsSection from './sections/transactions-section';
import ParentsSection from './sections/parents-section';
import VendorsSection from './sections/vendors-section';
import PosSection from './sections/pos-section';

const DRAWER_WIDTH = 280;

const navigationItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Building4,
    color: 'primary'
  },
  {
    id: 'students',
    label: 'Students',
    icon: People,
    color: 'secondary'
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: MoneyRecive,
    color: 'success'
  },
  {
    id: 'parents',
    label: 'Parents',
    icon: UserOctagon,
    color: 'warning'
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: Shop,
    color: 'info'
  },
  {
    id: 'posdevice',
    label: 'POS Devices',
    icon: DeviceMessage,
    color: 'error'
  }
];

const ViewSchool = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: schoolData, isLoading } = useGetGeneralSchoolById(id);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection schoolData={schoolData} />;
      case 'students':
        return <StudentsSection schoolId={id} />;
      case 'transactions':
        return <TransactionsSection schoolId={id} />;
      case 'parents':
        return <ParentsSection schoolId={id} />;
      case 'vendors':
        return <VendorsSection schoolId={id} />;
      case 'posdevice':
        return <PosSection schoolId={id} />;
      default:
        return <OverviewSection schoolData={schoolData} />;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Building4 size="32" color="white" />
          <Box>
            <Typography variant="h6" fontWeight="600" noWrap>
              {schoolData?.name || 'School Dashboard'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }} noWrap>
              {schoolData?.code || 'Loading...'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ px: 2, mb: 1 }}>
              <ListItemButton
                onClick={() => handleSectionChange(item.id)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? `${theme.palette[item.color].main}15` : 'transparent',
                  border: isActive ? `1px solid ${theme.palette[item.color].main}30` : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: `${theme.palette[item.color].main}10`
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon size="22" color={isActive ? theme.palette[item.color].main : theme.palette.text.secondary} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? theme.palette[item.color].main : theme.palette.text.primary
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sidebar Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          School Management System
        </Typography>
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading school data...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ flexShrink: 0 }}>
        <ClientCTA title="" showDo user={schoolData ? schoolData?.name : 'School Dashboard'} />
      </Box>

      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.grey[50] }}>
        {/* Mobile App Bar */}
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              width: '100%',
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: 'white',
              color: theme.palette.text.primary,
              boxShadow: 1
            }}
          >
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {navigationItems.find((item) => item.id === activeSection)?.label || 'Overview'}
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{
            width: { lg: DRAWER_WIDTH },
            flexShrink: { lg: 0 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                border: 'none',
                boxShadow: isMobile ? 3 : 1,
                position: isMobile ? 'fixed' : 'relative',
                height: '100vh'
              }
            }}
          >
            {isMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleDrawerToggle}>
                  <CloseSquare size="24" />
                </IconButton>
              </Box>
            )}
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
            mt: isMobile ? 8 : 0,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header CTA */}

          {/* Active Section Content */}
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>{renderActiveSection()}</Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default ViewSchool;
