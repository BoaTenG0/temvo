/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './util';
import { useUserState } from './hooks/useUserState';
import { useUserActions } from './hooks/useUserActions';
import UserStats from './components/UserStats';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
// import UserModals from './components/UserModals';
import { useGetGeneralSchool, useGetUsers, useGetRoles } from 'api/requests';
import UserModals from './modals/userModals';

export default function UserManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useUserState();

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers
  } = useGetUsers({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc']
  });

  const usersData = users?.data.content;

  const { data: schoolsData } = useGetGeneralSchool();
  const { data: rolesData } = useGetRoles();
  console.log("🚀 ~ UserManagement ~ rolesData:", rolesData)

  // Get users data (placeholder for now - will be replaced with actual API calls)
  //   const usersData = useMemo(
  //     () => [
  //       {
  //         id: 1,
  //         userName: 'Fred',
  //         email: 'fred@temvo.com',
  //         phoneNumber: '02445588660',
  //         role: 'Super Admin',
  //         assignedSchool: 'N/A',
  //         status: 'Active'
  //       },
  //       {
  //         id: 2,
  //         userName: 'Kwame',
  //         email: 'kwame@school.com',
  //         phoneNumber: '02445588660',
  //         role: 'Super Admin',
  //         assignedSchool: 'Accra Academy',
  //         status: 'Inactive'
  //       }
  //     ],
  //     []
  //   );

  // Calculate stats from real data
  const { activeCount, inactiveCount } = useMemo(() => {
    if (!usersData) return { activeCount: 0, inactiveCount: 0 };

    const active = usersData.filter((u) => u.status === 'Active').length;
    const inactive = usersData.filter((u) => u.status === 'Inactive').length;

    return { activeCount: active, inactiveCount: inactive };
  }, [usersData]);

  // Use actions hook with real data
  const actions = useUserActions(state, updateState, toggleModal, resetForm, usersData);

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
          <UserStats activeCount={activeCount} inactiveCount={inactiveCount} />

          {/* Filters Component */}
          <UserFilters
            state={state}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onRoleChange={actions.handleRoleChange}
            onStatusChange={actions.handleStatusChange}
          />

          {/* Table Component */}
          <UserTable
            state={state}
            usersData={users?.data}
            isLoading={usersLoading}
            onTabChange={actions.handleTabChange}
            onPageChange={actions.handleChangePage}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onOpenNewUser={actions.handleOpenNewUser}
            onEditUser={actions.handleOpenEdit}
            onDeleteUser={actions.handleOpenDelete}
            onViewUser={actions.handleOpenView}
          />

          {/* Modals Component */}
          <UserModals
            state={state}
            actions={actions}
            onFormChange={handleFormChange}
            schools={schoolsData?.data?.content}
            refetchUsers={refetchUsers}
            roles={rolesData?.content}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
