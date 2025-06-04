import { useState } from 'react';

export const useRoleState = () => {
  // Consolidated state object
  const [state, setState] = useState({
    // Tab management
    tabValue: 0, // 0 for roles, 1 for permissions

    // Roles pagination and display
    page: 0,
    rowsPerPage: 20,
    filtersExpanded: true,

    // Permissions pagination and display
    permissionPage: 0,
    permissionRowsPerPage: 20,

    // Search and filters for roles
    searchTerm: '',
    status: 'All',
    tableSearchTerm: '',

    // Search and filters for permissions
    permissionSearchTerm: '',
    permissionStatus: 'All',
    permissionTableSearchTerm: '',

    // Modal states for roles
    modals: {
      newRole: false,
      editRole: false,
      deleteRole: false,
      viewRole: false,
      newPermission: false,
      editPermission: false,
      deletePermission: false,
      viewPermission: false
    },

    // Form data for roles
    forms: {
      newRole: {
        name: '',
        description: '',
        permissions: [],
        active: true
      },
      editRole: {
        id: null,
        name: '',
        description: '',
        permissions: [],
        active: true
      },
      deleteRole: {
        id: null,
        name: ''
      },
      viewRole: {
        id: null,
        name: '',
        description: '',
        permissions: [],
        active: true,
        createdAt: '',
        updatedAt: ''
      },
      newPermission: {
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true
      },
      editPermission: {
        id: null,
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true
      },
      deletePermission: {
        id: null,
        name: ''
      },
      viewPermission: {
        id: null,
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true,
        createdAt: '',
        updatedAt: ''
      }
    }
  });

  // Update state helper
  const updateState = (updates) => {
    setState((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Update nested state helper
  const updateNestedState = (key, updates) => {
    setState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  // Modal handlers
  const toggleModal = (modalName, isOpen = null) => {
    updateNestedState('modals', {
      [modalName]: isOpen !== null ? isOpen : !state.modals[modalName]
    });
  };

  // Form handlers
  const updateForm = (formName, updates) => {
    updateNestedState('forms', {
      [formName]: {
        ...state.forms[formName],
        ...updates
      }
    });
  };

  const resetForm = (formName) => {
    const initialValues = {
      newRole: {
        name: '',
        description: '',
        permissions: [],
        active: true
      },
      editRole: {
        id: null,
        name: '',
        description: '',
        permissions: [],
        active: true
      },
      deleteRole: {
        id: null,
        name: ''
      },
      viewRole: {
        id: null,
        name: '',
        description: '',
        permissions: [],
        active: true,
        createdAt: '',
        updatedAt: ''
      },
      newPermission: {
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true
      },
      editPermission: {
        id: null,
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true
      },
      deletePermission: {
        id: null,
        name: ''
      },
      viewPermission: {
        id: null,
        name: '',
        description: '',
        resource: '',
        action: '',
        active: true,
        createdAt: '',
        updatedAt: ''
      }
    };

    updateNestedState('forms', {
      [formName]: initialValues[formName]
    });
  };

  return {
    state,
    updateState,
    updateNestedState,
    toggleModal,
    updateForm,
    resetForm
  };
};
