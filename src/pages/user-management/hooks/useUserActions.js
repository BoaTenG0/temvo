/* eslint-disable no-unused-vars */

import { useCallback } from 'react';

export const useUserActions = (state, updateState, toggleModal, resetForm, usersData) => {
  // Pagination handlers
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

  // Tab handlers
  const handleTabChange = useCallback(
    (event, newValue) => {
      updateState({ tabValue: newValue });
    },
    [updateState]
  );

  // Filter handlers
  const toggleFilters = useCallback(() => {
    updateState({ filtersExpanded: !state.filtersExpanded });
  }, [state.filtersExpanded, updateState]);

  const handleSearchChange = useCallback(
    (event) => {
      updateState({ searchTerm: event.target.value });
    },
    [updateState]
  );

  const handleTableSearchChange = useCallback(
    (event) => {
      updateState({ tableSearchTerm: event.target.value });
    },
    [updateState]
  );

  const handleRoleChange = useCallback(
    (event) => {
      updateState({ role: event.target.value });
    },
    [updateState]
  );

  const handleStatusChange = useCallback(
    (event) => {
      updateState({ status: event.target.value });
    },
    [updateState]
  );

  // Modal handlers
  const handleOpenNewUser = useCallback(() => {
    toggleModal('newUser', true);
  }, [toggleModal]);

  const handleCloseNewUser = useCallback(() => {
    toggleModal('newUser', false);
    resetForm('newUser');
  }, [toggleModal, resetForm]);

  const handleOpenEdit = useCallback(
    (user) => {
      // Pre-populate edit form with user data
      updateState({
        forms: {
          ...state.forms,
          editUser: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            assignedSchool: user.assignedSchool
          }
        }
      });
      toggleModal('editUser', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseEdit = useCallback(() => {
    toggleModal('editUser', false);
    resetForm('editUser');
  }, [toggleModal, resetForm]);

  const handleOpenDelete = useCallback(
    (user) => {
      console.log('🚀 ~ useUserActions ~ user:', user);
      updateState({
        forms: {
          ...state.forms,
          deleteUser: {
            id: user.id,
            userName: user.firstName + " " + user.lastName
          }
        }
      });
      toggleModal('deleteUser', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleOpenView = useCallback(
    (user) => {
      updateState({
        forms: {
          ...state.forms,
          viewUser: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            assignedSchool: user.assignedSchool
          }
        }
      });
      toggleModal('viewUser', true);
    },
    [state.forms, updateState, toggleModal]
  );

  const handleCloseDelete = useCallback(() => {
    toggleModal('deleteUser', false);
    resetForm('deleteUser');
  }, [toggleModal, resetForm]);

  // CRUD operations (placeholder implementations)
  const handleCreateUser = useCallback(() => {
    // In a real app, this would call an API
    console.log('Creating user:', state.forms.newUser);
    handleCloseNewUser();
  }, [state.forms.newUser, handleCloseNewUser]);

  const handleUpdateUser = useCallback(() => {
    // In a real app, this would call an API
    console.log('Updating user:', state.forms.editUser);
    handleCloseEdit();
  }, [state.forms.editUser, handleCloseEdit]);

  const handleDeleteUser = useCallback(() => {
    // In a real app, this would call an API
    console.log('Deleting user:', state.forms.deleteUser);
    handleCloseDelete();
  }, [state.forms.deleteUser, handleCloseDelete]);

  return {
    // Pagination
    handleChangePage,
    handleChangeRowsPerPage,

    // Tabs
    handleTabChange,

    // Filters
    toggleFilters,
    handleSearchChange,
    handleTableSearchChange,
    handleRoleChange,
    handleStatusChange,

    // Modals
    handleOpenNewUser,
    handleCloseNewUser,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,

    // CRUD
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleOpenView
  };
};
