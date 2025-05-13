import { Button } from '@mui/material';
import MainCard from 'components/MainCard';
import React from 'react';

const QuickActions = () => {
  return (
    <MainCard title="Quick Actions" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Button variant="contained" color="primary" sx={{ borderRadius: 3, mb: 3, mt: 5, width: '100%' }}>
        Manage Schools
      </Button>
      <Button variant="contained" color="info" sx={{ borderRadius: 3, mb: 3, width: '100%' }}>
        NFC Wristbands
      </Button>
      <Button variant="contained" color="success" sx={{ borderRadius: 3, width: '100%' }}>
        POS Management
      </Button>
    </MainCard>
  );
};

export default QuickActions;
