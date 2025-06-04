import { useState } from 'react';

export const useTransactionState = () => {
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
    status: 'All',
    tableSearchTerm: '',

    // Modal states
    modals: {
      print: false
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
  const updateForm = () => {};
  const resetForm = () => {};

  return {
    state,
    updateState,
    updateNestedState,
    toggleModal,
    updateForm,
    resetForm
  };
};
