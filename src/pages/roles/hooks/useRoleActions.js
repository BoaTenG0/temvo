/* eslint-disable no-unused-vars */

import { useCallback } from 'react';

export const useRoleActions = (state, updateState, toggleModal, resetForm, rolesData) => {
  // Tab handlers
  const handleTabChange = useCallback(
    (event, newValue) => {
      updateState({ tabValue: newValue });
    },
    [updateState]
  );

  // Roles pagination handlers
  const handleChangePage = useCallback(
    (event, newPage) => {
      updateState({ page: newPage });
    },
    [updateState]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      updateState({
        rowsPerPage: Number.parseInt(event.target.value, 10),
        page: 0
      });
    },
    [updateState]
  );

  // Permissions pagination handlers
  const handlePermissionPageChange = useCallback(
    (event, newPage) => {
      updateState({ permissionPage: newPage });
    },
    [updateState]
  );

  const handlePermissionRowsPerPageChange = useCallback(
    (event) => {
      updateState({
        permissionRowsPerPage: Number.parseInt(event.target.value, 10),
        permissionPage: 0
      });
    },
    [updateState]
  );

  // Filter handlers
  const toggleFilters = useCallback(() => {
    updateState({ filtersExpanded: !state.filtersExpanded });
  }, [state.filtersExpanded, updateState]);

  const handleSearchChange = useCallback(
    (event) => {
      if (state.tabValue === 0) {
        updateState({ searchTerm: event.target.value, page: 0 });
      } else {
        updateState({ permissionSearchTerm: event.target.value, permissionPage: 0 });
      }
    },
    [updateState, state.tabValue]
  );

  const handleStatusChange = useCallback(
    (event) => {
      if (state.tabValue === 0) {
        updateState({ status: event.target.value, page: 0 });
      } else {
        updateState({ permissionStatus: event.target.value, permissionPage: 0 });
      }
    },
    [updateState, state.tabValue]
  );

  const handleTableSearchChange = useCallback(
    (event) => {
      updateState({ tableSearchTerm: event.target.value, page: 0 });
    },
    [updateState]
  );

  // Permission filter handlers
  const handlePermissionSearchChange = useCallback(
    (event) => {
      updateState({ permissionSearchTerm: event.target.value, permissionPage: 0 });
    },
    [updateState]
  );

  const handlePermissionStatusChange = useCallback(
    (event) => {
      updateState({ permissionStatus: event.target.value, permissionPage: 0 });
    },
    [updateState]
  );

  const handlePermissionTableSearchChange = useCallback(
    (event) => {
      updateState({ permissionTableSearchTerm: event.target.value, permissionPage: 0 });
    },
    [updateState]
  );

  // Role modal handlers
  const handleOpenNewRole = useCallback(() => {
    resetForm('newRole');
    toggleModal('newRole', true);
  }, [resetForm, toggleModal]);

  const handleCloseNewRole = useCallback(() => {
    toggleModal('newRole', false);
    resetForm('newRole');
  }, [toggleModal, resetForm]);

  const handleOpenEdit = useCallback(
    (role) => {
      updateState({
        forms: {
          ...state.forms,
          editRole: {
            id: role.id,
            name: role.name || '',
            description: role.description || '',
            permissions: role.permissions || [],
            active: role.active !== undefined ? role.active : true
          }
        }
      });
      toggleModal('editRole', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseEdit = useCallback(() => {
    toggleModal('editRole', false);
    resetForm('editRole');
  }, [toggleModal, resetForm]);

  const handleOpenDelete = useCallback(
    (role) => {
      updateState({
        forms: {
          ...state.forms,
          deleteRole: {
            id: role.id,
            name: role.name || ''
          }
        }
      });
      toggleModal('deleteRole', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseDelete = useCallback(() => {
    toggleModal('deleteRole', false);
    resetForm('deleteRole');
  }, [toggleModal, resetForm]);

  const handleOpenView = useCallback(
    (role) => {
      updateState({
        forms: {
          ...state.forms,
          viewRole: {
            id: role.id,
            name: role.name || '',
            description: role.description || '',
            permissions: role.permissions || [],
            active: role.active !== undefined ? role.active : true,
            createdAt: role.createdAt || '',
            updatedAt: role.updatedAt || ''
          }
        }
      });
      toggleModal('viewRole', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseView = useCallback(() => {
    toggleModal('viewRole', false);
    resetForm('viewRole');
  }, [toggleModal, resetForm]);

  // Permission modal handlers
  const handleOpenNewPermission = useCallback(() => {
    resetForm('newPermission');
    toggleModal('newPermission', true);
  }, [resetForm, toggleModal]);

  const handleCloseNewPermission = useCallback(() => {
    toggleModal('newPermission', false);
    resetForm('newPermission');
  }, [toggleModal, resetForm]);

  const handleOpenEditPermission = useCallback(
    (permission) => {
      updateState({
        forms: {
          ...state.forms,
          editPermission: {
            id: permission.id,
            name: permission.name || '',
            description: permission.description || '',
            resource: permission.resource || '',
            action: permission.action || '',
            active: permission.active !== undefined ? permission.active : true
          }
        }
      });
      toggleModal('editPermission', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseEditPermission = useCallback(() => {
    toggleModal('editPermission', false);
    resetForm('editPermission');
  }, [toggleModal, resetForm]);

  const handleOpenDeletePermission = useCallback(
    (permission) => {
      updateState({
        forms: {
          ...state.forms,
          deletePermission: {
            id: permission.id,
            name: permission.name || ''
          }
        }
      });
      toggleModal('deletePermission', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseDeletePermission = useCallback(() => {
    toggleModal('deletePermission', false);
    resetForm('deletePermission');
  }, [toggleModal, resetForm]);

  const handleOpenViewPermission = useCallback(
    (permission) => {
      updateState({
        forms: {
          ...state.forms,
          viewPermission: {
            id: permission.id,
            name: permission.name || '',
            description: permission.description || '',
            resource: permission.resource || '',
            action: permission.action || '',
            active: permission.active !== undefined ? permission.active : true,
            createdAt: permission.createdAt || '',
            updatedAt: permission.updatedAt || ''
          }
        }
      });
      toggleModal('viewPermission', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseViewPermission = useCallback(() => {
    toggleModal('viewPermission', false);
    resetForm('viewPermission');
  }, [toggleModal, resetForm]);

  return {
    // Tab handlers
    handleTabChange,

    // Roles pagination
    handleChangePage,
    handleChangeRowsPerPage,

    // Permissions pagination
    handlePermissionPageChange,
    handlePermissionRowsPerPageChange,

    // Filter handlers
    toggleFilters,
    handleSearchChange,
    handleStatusChange,
    handleTableSearchChange,
    handlePermissionSearchChange,
    handlePermissionStatusChange,
    handlePermissionTableSearchChange,

    // Role modal handlers
    handleOpenNewRole,
    handleCloseNewRole,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
    handleOpenView,
    handleCloseView,

    // Permission modal handlers
    handleOpenNewPermission,
    handleCloseNewPermission,
    handleOpenEditPermission,
    handleCloseEditPermission,
    handleOpenDeletePermission,
    handleCloseDeletePermission,
    handleOpenViewPermission,
    handleCloseViewPermission
  };
};
