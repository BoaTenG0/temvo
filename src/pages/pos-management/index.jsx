/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './constants/posConstants';
import { usePosState } from './hooks/usePosState';
import { usePosActions } from './hooks/usePosActions';
import PosStats from './components/PosStats';
import PosFilters from './components/PosFilters';
import PosTable from './components/PosTable';
import PosModals from './components/PosModals';
import { useGetPOS, useGetGeneralSchool } from 'api/requests';
import { convertDateJS } from 'utils/hooks';

export default function PosManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = usePosState();

  // Get wristbands with pagination and filters
  const {
    data: pos,
    isLoading: posLoading,
    refetch: refetchPos
  } = useGetPOS({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc'],
    status: state.status,
    schoolId: state.school,
    from: convertDateJS(state.dateRange[0]),
    to: convertDateJS(state.dateRange[1])
  });

  // Get all schools for filters
  const { data: schoolsData } = useGetGeneralSchool();

  const posData = pos?.data.content;

  // Calculate stats from real data
  const { assignedCount, unassignedCount } = useMemo(() => {
    if (!posData) return { assignedCount: 0, unassignedCount: 0 };

    const assigned = posData.filter((p) => p.status === 'active' && p.schoolId).length;
    const unassigned = posData.filter((p) => p.status === 'active' && !p.schoolId).length;

    return { assignedCount: assigned, unassignedCount: unassigned };
  }, [posData]);

  // extract status from posData
  const status = useMemo(() => {
    if (!posData) return [];
    return [...new Set(posData.map((p) => p.status))];
  }, [posData]);

  // Use actions hook
  const actions = usePosActions(state, updateState, toggleModal, resetForm, posData);

  // Form change handler
  const handleFormChange = (formName, updates) => {
    if (formName === 'selectedFile') {
      updateNestedState('forms', { selectedFile: updates });
    } else {
      updateForm(formName, updates);
    }
  };

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Stats Component */}
          <PosStats assignedCount={assignedCount} unassignedCount={unassignedCount} />

          {/* Filters Component */}
          <PosFilters
            state={state}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onDateRangeChange={actions.handleDateRangeChange}
            onSchoolChange={actions.handleSchoolChange}
            onStatusChange={actions.handleStatusChange}
            school={schoolsData?.data.content || []}
            status={status || []}
          />

          {/* Table Component */}
          <PosTable
            state={state}
            posData={pos?.data}
            isLoading={posLoading}
            onTabChange={actions.handleTabChange}
            onPageChange={actions.handleChangePage}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onOpenNewPos={actions.handleOpenNewPos}
            onOpenBulkPos={actions.handleOpenBulkPos}
            onOpenAssignPos={actions.handleOpenAssignPos}
            onDeletePos={actions.handleOpenDelete}
            onDeactivatePOS={actions.handleOpenDeactivate}
            onActivatePOS={actions.handleOpenActivate}
            refetchPos={refetchPos}
          />

          {/* Modals Component */}
          <PosModals
            state={state}
            actions={actions}
            onFormChange={handleFormChange}
            refetchPos={refetchPos}
            schools={schoolsData?.data.content}
            availablePosDevices={pos?.data?.content}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
