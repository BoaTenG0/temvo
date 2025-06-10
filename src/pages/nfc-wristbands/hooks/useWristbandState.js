import { useState } from 'react';
import { initialNewWristband, initialAssignData } from '../constants/wristbandConstants';
import dayjs from 'dayjs';

export const useWristbandState = () => {
  // Consolidated state object
  const initialStartDate = dayjs().subtract(7, 'days');
  const initialEndDate = dayjs();
  const [state, setState] = useState({
    // Pagination and display
    page: 0,
    rowsPerPage: 20,
    tabValue: 0,
    filtersExpanded: true,

    // Search and filters
    searchTerm: '',
    dateRange: [initialStartDate.toDate(), initialEndDate.toDate()],
    school: '',
    status: 'All',
    tableSearchTerm: '',

    // Modal states
    modals: {
      newWristband: false,
      bulkWristband: false,
      assignWristband: false,
      delete: false,
      deactivate: false
    },
    wristbandData: null,
    deleteId: null,
    deactivateId: null,

    // Form data
    forms: {
      newWristband: initialNewWristband,
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
      newWristband: initialNewWristband,
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
