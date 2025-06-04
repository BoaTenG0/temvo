/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './util';
import { useReportState } from './hooks/useReportState';
import { useReportActions } from './hooks/useReportActions';
import ReportStats from './components/ReportStats';
import ReportFilters from './components/ReportFilters';
import ReportCharts from './components/ReportCharts';
import ReportBreakdown from './components/ReportBreakdown';

export default function ReportsManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useReportState();

  // Get reports data (placeholder for now - will be replaced with actual API calls)
  const reportsData = useMemo(
    () => [
      {
        id: 1,
        type: 'Temvo-to-Temvo',
        school: 'Accra Academy',
        amount: '20,000',
        dbid: '1718290',
        crid: '187303',
        date: '17/02/2025',
        status: 'Successful'
      },
      {
        id: 2,
        type: 'Temvo-to-Temvo',
        school: 'Accra Academy',
        amount: '20,000',
        dbid: '1718290',
        crid: '187303',
        date: '17/02/2025',
        status: 'Failed'
      }
    ],
    []
  );

  // Calculate stats from real data
  const { successfulCount, failedCount } = useMemo(() => {
    if (!reportsData) return { successfulCount: 0, failedCount: 0 };

    const successful = reportsData.filter((r) => r.status === 'Successful').length;
    const failed = reportsData.filter((r) => r.status === 'Failed').length;

    return { successfulCount: successful, failedCount: failed };
  }, [reportsData]);

  // Use actions hook with real data
  const actions = useReportActions(state, updateState, toggleModal, resetForm, reportsData);

  // Form change handler
  const handleFormChange = (formName, updates) => {
    if (formName === 'selectedFile') {
      updateNestedState('forms', { selectedFile: updates });
    } else {
      updateForm(formName, updates);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Stats Component */}
          <ReportStats successfulCount={successfulCount} failedCount={failedCount} />

          {/* Filters Component */}
          <ReportFilters
            state={state}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onDateRangeChange={actions.handleDateRangeChange}
            onSchoolChange={actions.handleSchoolChange}
            onStatusChange={actions.handleStatusChange}
          />

          {/* Charts Component */}
          <ReportCharts state={state} onTabChange={actions.handleTabChange} />

          {/* Breakdown Component */}
          <ReportBreakdown />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
