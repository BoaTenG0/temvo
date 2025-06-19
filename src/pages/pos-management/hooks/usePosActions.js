import { format } from 'date-fns';

export const usePosActions = (state, updateState, toggleModal, resetForm) => {
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    updateState({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    updateState({
      rowsPerPage: Number.parseInt(event.target.value, 10),
      page: 0
    });
  };

  // Tab handler
  const handleTabChange = (event, newValue) => {
    updateState({ tabValue: newValue });
  };
  const handleOpenDeactivate = (id) => {
    updateState({ deactivateId: id });

    toggleModal('deactivate', true);
  };
  const handleCloseDeactivate = () => {
    toggleModal('deactivate', false);
  };

  const handleCloseDeactivatePOS = () => {
    // Handle delete logic here
    handleCloseDeactivate();
  };
  const handleOpenActivate = (id) => {
    updateState({ activateId: id });

    toggleModal('activate', true);
  };
  const handleCloseActivate = () => {
    toggleModal('activate', false);
  };

  const handleCloseActivatePOS = () => {
    // Handle delete logic here
    handleCloseActivate();
  };

  // Filter handlers
  const toggleFilters = () => {
    updateState({ filtersExpanded: !state.filtersExpanded });
  };

  const handleSearchChange = (value) => {
    updateState({ searchTerm: value });
  };

  const handleTableSearchChange = (value) => {
    updateState({ tableSearchTerm: value });
  };

  const handleDateRangeChange = (newValue) => {
    updateState({ dateRange: newValue });
  };

  const handleSchoolChange = (value) => {
    updateState({ school: value });
  };

  const handleStatusChange = (value) => {
    updateState({ status: value });
  };

  // Modal handlers
  const handleOpenNewPos = () => {
    toggleModal('newPos', true);
  };

  const handleCloseNewPos = () => {
    toggleModal('newPos', false);
    resetForm('newPos');
  };

  const handleOpenBulkPos = () => {
    toggleModal('bulkPos', true);
  };

  const handleCloseBulkPos = () => {
    toggleModal('bulkPos', false);
    resetForm('selectedFile');
  };

  const handleOpenAssignPos = (posId) => {
    updateState({ selectedAssignPosId: posId || null });
    toggleModal('assignPos', true);
  };

  const handleCloseAssignPos = () => {
    toggleModal('assignPos', false);
    resetForm('assignData');
  };

  const handleOpenDelete = (id) => {
    updateState({ deleteId: id });

    toggleModal('delete', true);
  };

  const handleCloseDelete = () => {
    toggleModal('delete', false);
  };

  // CRUD operations
  const handleRegisterPos = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const newItem = {
      id: state.posDevices.length + 1,
      ...state.forms.newPos,
      dateRegistered: formattedDate,
      dateAssigned: 'N/A',
      assignedSchool: 'N/A',
      status: 'Unassigned'
    };

    updateState({
      posDevices: [...state.posDevices, newItem]
    });
    handleCloseNewPos();
  };

  const handleBulkRegister = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const bulkItems = [
      {
        id: state.posDevices.length + 1,
        modelName: 'Bulk-POS-xu3000',
        modelNumber: 'POS-57687903',
        serialNumber: 'tbw-09300018380',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      },
      {
        id: state.posDevices.length + 2,
        modelName: 'Bulk-POS-xu3001',
        modelNumber: 'POS-57687904',
        serialNumber: 'tbw-09300018381',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      }
    ];

    updateState({
      posDevices: [...state.posDevices, ...bulkItems]
    });
    handleCloseBulkPos();
  };

  const handleAssignPosDevices = () => {
    const count = Number.parseInt(state.forms.assignData.count, 10);
    if (isNaN(count) || count <= 0) return;

    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const updatedPosDevices = [...state.posDevices];
    let assigned = 0;

    for (let i = 0; i < updatedPosDevices.length && assigned < count; i++) {
      if (updatedPosDevices[i].status === 'Unassigned') {
        updatedPosDevices[i].status = 'Assigned';
        updatedPosDevices[i].assignedSchool = state.forms.assignData.school;
        updatedPosDevices[i].dateAssigned = formattedDate;
        assigned++;
      }
    }

    updateState({ posDevices: updatedPosDevices });
    handleCloseAssignPos();
  };

  const handleDeletePos = () => {
    // Handle delete logic here
    console.log('Delete POS device');
    handleCloseDelete();
  };

  return {
    // Pagination
    handleChangePage,
    handleChangeRowsPerPage,

    // Tabs and filters
    handleTabChange,
    toggleFilters,
    handleSearchChange,
    handleTableSearchChange,
    handleDateRangeChange,
    handleSchoolChange,
    handleStatusChange,

    // Modals
    handleOpenNewPos,
    handleCloseNewPos,
    handleOpenBulkPos,
    handleCloseBulkPos,
    handleOpenAssignPos,
    handleCloseAssignPos,
    handleOpenDelete,
    handleCloseDelete,

    // CRUD operations
    handleRegisterPos,
    handleBulkRegister,
    handleAssignPosDevices,
    handleDeletePos,
    handleOpenDeactivate,
    handleCloseDeactivate,
    handleOpenActivate,
    handleCloseActivate,
    handleCloseActivatePOS,
    handleCloseDeactivatePOS
  };
};
