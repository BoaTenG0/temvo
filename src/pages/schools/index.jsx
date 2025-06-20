/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './util';
import { useSchoolState } from './hooks/useSchoolState';
import { useSchoolActions } from './hooks/useSchoolActions';
import SchoolStats from './components/SchoolStats';
import SchoolFilters from './components/SchoolFilters';
import SchoolTable from './components/SchoolTable';
import SchoolModals from './components/SchoolModals';
import { useGetGeneralSchool } from 'api/requests';
import { convertDateJS } from 'utils/hooks';

export default function SchoolManagement() {
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useSchoolState();

  const {
    data: schoolsDataApi,
    isLoading: schoolDataLoading,
    refetch: refetchSchools
  } = useGetGeneralSchool({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc'],
    from: convertDateJS(state.dateRange[0]),
    to: convertDateJS(state.dateRange[1])
  });

  const schoolsData = schoolsDataApi?.data?.content;

  // Calculate stats from real data
  const { assignedCount, unassignedCount } = useMemo(() => {
    if (!schoolsData) return { assignedCount: 0, unassignedCount: 0 };

    const assigned = schoolsData.filter((s) => s.status === 'Assigned').length;
    const unassigned = schoolsData.filter((s) => s.status === 'Unassigned').length;

    return { assignedCount: assigned, unassignedCount: unassigned };
  }, [schoolsData]);

  // Use actions hook with real data
  const actions = useSchoolActions(state, updateState, toggleModal, resetForm, schoolsData);

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

          <p>huhe</p>
          <SchoolStats assignedCount={assignedCount} unassignedCount={unassignedCount} />

          {/* Filters Component */}
          <SchoolFilters
            state={state}
            schools={schoolsData || []}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onDateRangeChange={actions.handleDateRangeChange}
            onSchoolChange={actions.handleSchoolChange}
            onStatusChange={actions.handleStatusChange}
          />

          {/* Table Component */}
          <SchoolTable
            state={state}
            schoolsData={schoolsDataApi?.data}
            isLoading={schoolDataLoading}
            onTabChange={actions.handleTabChange}
            onPageChange={actions.handleChangePage}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onOpenNewSchool={actions.handleOpenNewSchool}
            onOpenBulkSchool={actions.handleOpenBulkSchool}
            onOpenAssignSchool={actions.handleOpenAssignSchool}
            onViewSchool={actions.handleOpenView}
            onEditSchool={actions.handleOpenEdit}
            onDeleteSchool={actions.handleOpenDelete}
            refetch={refetchSchools}
          />

          {/* Modals Component */}
          <SchoolModals
            state={state}
            actions={actions}
            onFormChange={handleFormChange}
            schools={schoolsData}
            refetchSchools={refetchSchools}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
