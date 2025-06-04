import { useState } from 'react';

export const useUserState = () => {
  // Consolidated state object
  const [state, setState] = useState({
    // Pagination and display
    page: 0,
    rowsPerPage: 20,
    tabValue: 0,
    filtersExpanded: true,

    // Search and filters
    searchTerm: '',
    role: 'All',
    status: 'All',
    tableSearchTerm: '',

    // Modal states
    modals: {
      newUser: false,
      editUser: false,
      deleteUser: false
    },

    // Form data
    forms: {
      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        userType: '',
        password: '',
        assignedSchool: '',
        active: false
      },
      editUser: {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        userType: '',
        password: '',
        assignedSchool: ''
      },
      deleteUser: {
        id: null,
        userName: ''
      },
      viewUser: {
        id: null,
        userName: '',
        email: '',
        phoneNumber: '',
        role: '',
        assignedSchool: ''
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
      newUser: {
        userName: '',
        email: '',
        phoneNumber: '',
        role: '',
        assignedSchool: ''
      },
      editUser: {
        id: null,
        userName: '',
        email: '',
        phoneNumber: '',
        role: '',
        assignedSchool: ''
      },
      deleteUser: {
        id: null,
        userName: ''
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
