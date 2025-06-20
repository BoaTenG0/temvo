import dayjs from 'dayjs';
import { useState } from 'react';

export const useUserState = () => {
  // Consolidated state object
  const initialStartDate = dayjs().subtract(7, 'days');
  const initialEndDate = dayjs();
  const [state, setState] = useState({
    // Pagination and display
    page: 0,
    rowsPerPage: 10,
    tabValue: 0,
    filtersExpanded: true,

    // Search and filters
    searchTerm: '',
    role: 'All',
    status: 'All',
    tableSearchTerm: '',
    dateRange: [initialStartDate.toDate(), initialEndDate.toDate()],

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
      editUser: {},
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
