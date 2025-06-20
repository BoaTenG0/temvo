/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './util';
import { useWristbandState } from './hooks/useWristbandState';
import { useWristbandActions } from './hooks/useWristbandActions';
import WristbandStats from './components/WristbandStats';
import WristbandFilters from './components/WristbandFilters';
import WristbandTable from './components/WristbandTable';
import WristbandModals from './components/WristbandModals';
import { useGetGeneralSchool, useGetWristbands } from 'api/requests';
import { useSelector } from 'store';
function convertDateJS(isoDateString) {
  const date = new Date(isoDateString);
  return date.toISOString(); // returns full ISO string like "2025-06-10T03:37:21.719Z"
}

export default function WristbandManagement() {
  // Use consolidated state management
  const userInfo = useSelector((state) => state.user.userInfo);
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useWristbandState();

  // Get wristbands with pagination and filters
  const {
    data: wristbands,
    isLoading: wristbandsLoading,
    refetch: refetchWristbands
  } = useGetWristbands({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc'],
    schoolId: state.school !== '' ? state.school : '',
    from: convertDateJS(state.dateRange[0]),
    to: convertDateJS(state.dateRange[1])
  });

  // Get all schools for filters
  const { data: schoolsData } = useGetGeneralSchool();

  const wristbandsData = wristbands?.data.content;

  // Calculate stats from real data
  const { assignedCount, unassignedCount } = useMemo(() => {
    if (!wristbandsData) return { assignedCount: 0, unassignedCount: 0 };

    const assigned = wristbandsData.filter((w) => w.status === 'active' && w.schoolId).length;
    const unassigned = wristbandsData.filter((w) => w.status === 'active' && !w.schoolId).length;

    return { assignedCount: assigned, unassignedCount: unassigned };
  }, [wristbandsData]);

  // Use actions hook with real data
  const actions = useWristbandActions(state, updateState, toggleModal, resetForm, wristbandsData);

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
          <WristbandStats assignedCount={assignedCount} unassignedCount={unassignedCount} />

          {/* Filters Component */}
          <WristbandFilters
            state={state}
            schools={schoolsData?.data.content || []}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onDateRangeChange={actions.handleDateRangeChange}
            onSchoolChange={actions.handleSchoolChange}
            onStatusChange={actions.handleStatusChange}
            userInfo={userInfo}
          />

          {/* Table Component */}
          <WristbandTable
            state={state}
            wristbandsData={wristbands?.data}
            isLoading={wristbandsLoading}
            onTabChange={actions.handleTabChange}
            onPageChange={actions.handleChangePage}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onOpenNewWristband={actions.handleOpenNewWristband}
            onOpenBulkWristband={actions.handleOpenBulkWristband}
            onOpenAssignWristband={actions.handleOpenAssignWristband}
            onDeleteWristband={actions.handleOpenDelete}
            onDeactivateWristband={actions.handleOpenDeactivate}
          />

          {/* Modals Component */}
          <WristbandModals
            state={state}
            actions={actions}
            onFormChange={handleFormChange}
            refetchWristbands={refetchWristbands}
            schools={schoolsData?.data.content}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
