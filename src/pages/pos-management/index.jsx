/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React from 'react';
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

export default function PosManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm, assignedCount, unassignedCount } = usePosState();

  // Use actions hook
  const actions = usePosActions(state, updateState, toggleModal, resetForm);

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
          />

          {/* Table Component */}
          <PosTable
            state={state}
            onTabChange={actions.handleTabChange}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onOpenNewPos={actions.handleOpenNewPos}
            onOpenBulkPos={actions.handleOpenBulkPos}
            onOpenAssignPos={actions.handleOpenAssignPos}
            onDeletePos={actions.handleOpenDelete}
          />

          {/* Modals Component */}
          <PosModals state={state} actions={actions} onFormChange={handleFormChange} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
