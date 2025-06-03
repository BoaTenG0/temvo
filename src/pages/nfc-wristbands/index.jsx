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

export default function WristbandManagement() {
  // Use consolidated state management
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
    sort: ['desc']
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

  console.log('🚀 ~ WristbandManagement ~ wristbandsData:', wristbandsData);
  console.log('🚀 ~ WristbandManagement ~ schoolsData:', schoolsData?.data.content);

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
