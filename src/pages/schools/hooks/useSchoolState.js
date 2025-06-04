import { useState } from 'react';
import { initialNewSchool, initialAssignData } from '../constants/schoolConstants';

export const useSchoolState = () => {
  // Consolidated state object
  const [state, setState] = useState({
    // Pagination and display
    page: 0,
    rowsPerPage: 20,
    tabValue: 0,
    filtersExpanded: true,

    // Search and filters
    searchTerm: '',
    dateRange: [null, null],
    school: 'All',
    region: 'All',
    status: 'All',
    tableSearchTerm: '',

    // Modal states
    modals: {
      newSchool: false,
      bulkSchool: false,
      assignSchool: false,
      viewSchool: false,
      editSchool: false,
      delete: false
    },
    schoolData: null,
    deleteId: null,

    // Form data
    forms: {
      newSchool: initialNewSchool,
      assignData: initialAssignData,
      selectedFile: null
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
      newSchool: initialNewSchool,
      assignData: initialAssignData,
      selectedFile: null
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
