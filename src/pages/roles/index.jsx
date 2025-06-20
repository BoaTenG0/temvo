/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container, Card, CardContent, Tabs, Tab } from '@mui/material';
import { SecuritySafe, Key } from 'iconsax-react';

// Project imports
import { theme } from './util';
import { useRoleState } from './hooks/useRoleState';
import { useRoleActions } from './hooks/useRoleActions';
import RoleStats from './components/RoleStats';
import RoleFilters from './components/RoleFilters';
import RoleTable from './components/RoleTable';
import PermissionTable from './components/PermissionTable';
import RoleModals from './modals/RoleModals';
import PermissionModals from './modals/PermissionModals';
import { useGetRoles, useGetPermissions } from 'api/requests';

export default function RolesAndPermissions() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useRoleState();

  // Fetch roles data
  const {
    data: roles,
    isLoading: rolesLoading,
    refetch: refetchRoles
  } = useGetRoles({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc']
  });

  // Fetch permissions data
  const {
    data: permissions,
    isLoading: permissionsLoading,
    refetch: refetchPermissions
  } = useGetPermissions({
    page: state.permissionPage,
    size: state.permissionRowsPerPage,
    search: state.permissionSearchTerm || state.permissionTableSearchTerm || '',
    sort: ['desc']
  });
  const roleData = roles?.content;
  // Use actions hook
  const actions = useRoleActions(state, updateState, toggleModal, resetForm, roles?.content);

  // Handle form changes
  const handleFormChange = (formName, field, value) => {
    updateForm(formName, { [field]: value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 3
        }}
      >
        <Container maxWidth="xl">
          {/* Stats Component */}
          <RoleStats
            rolesCount={roles?.totalElements || 0}
            permissionsCount={permissions?.data?.totalElements || 0}
            activeRolesCount={roleData?.filter((role) => role.active)?.length || 0}
          />

          {/* Filters Component */}
          <RoleFilters
            state={state}
            onSearchChange={actions.handleSearchChange}
            onStatusChange={actions.handleStatusChange}
            onToggleFilters={actions.toggleFilters}
          />

          {/* Main Content Card with Tab Navigation */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {/* Tabs Navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
                <Tabs value={state.tabValue} onChange={actions.handleTabChange} aria-label="roles and permissions tabs">
                  <Tab
                    icon={<SecuritySafe size="20" />}
                    label="Roles"
                    iconPosition="start"
                    sx={{
                      minHeight: 48,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}
                  />
                  <Tab
                    icon={<Key size="20" />}
                    label="Permissions"
                    iconPosition="start"
                    sx={{
                      minHeight: 48,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}
                  />
                </Tabs>
              </Box>

              {/* Table Content */}
              {state.tabValue === 0 ? (
                <RoleTable
                  state={state}
                  rolesData={roles}
                  isLoading={rolesLoading}
                  onPageChange={actions.handleChangePage}
                  onRowsPerPageChange={actions.handleChangeRowsPerPage}
                  onTableSearchChange={actions.handleTableSearchChange}
                  onOpenNewRole={actions.handleOpenNewRole}
                  onEditRole={actions.handleOpenEdit}
                  onDeleteRole={actions.handleOpenDelete}
                  onViewRole={actions.handleOpenView}
                />
              ) : (
                <PermissionTable
                  state={state}
                  permissionsData={permissions?.data}
                  isLoading={permissionsLoading}
                  onPageChange={actions.handlePermissionPageChange}
                  onRowsPerPageChange={actions.handlePermissionRowsPerPageChange}
                  onTableSearchChange={actions.handlePermissionTableSearchChange}
                  onOpenNewPermission={actions.handleOpenNewPermission}
                  onEditPermission={actions.handleOpenEditPermission}
                  onDeletePermission={actions.handleOpenDeletePermission}
                  onViewPermission={actions.handleOpenViewPermission}
                />
              )}
            </CardContent>
          </Card>

          {/* Modals Components */}
          <RoleModals
            state={state}
            actions={actions}
            onFormChange={handleFormChange}
            refetchRoles={refetchRoles}
            permissions={permissions?.data?.content}
          />

          <PermissionModals state={state} actions={actions} onFormChange={handleFormChange} refetchPermissions={refetchPermissions} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
