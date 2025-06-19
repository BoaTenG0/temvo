import React from 'react';
import NewPosModal from './modals/NewPosModal';
import BulkPosModal from './modals/BulkPosModal';
import AssignPosModal from './modals/AssignPosModal';
import DeletePosModal from './modals/DeletePosModal';
import DeactivatePOSModal from './modals/DeactivatePosModal';
import ActivatePOSModal from './modals/ActivatePosModal';

const PosModals = ({ state, actions, onFormChange, refetchPos, schools, availablePosDevices }) => {
  const handleNewPosFormChange = (updates) => {
    onFormChange('newPos', updates);
  };

  const handleAssignFormChange = (updates) => {
    onFormChange('assignData', updates);
  };

  const handleFileChange = (file) => {
    onFormChange('selectedFile', file);
  };

  return (
    <>
      {/* Register New POS Modal */}
      <NewPosModal
        open={state.modals.newPos}
        onClose={actions.handleCloseNewPos}
        formData={state.forms.newPos}
        onFormChange={handleNewPosFormChange}
        onSubmit={actions.handleRegisterPos}
        // onSubmit={actions.handleRegisterPos}
        refetchPos={refetchPos}
      />

      {/* Register Bulk POS Modal */}
      <BulkPosModal
        open={state.modals.bulkPos}
        onClose={actions.handleCloseBulkPos}
        selectedFile={state.forms.selectedFile}
        onFileChange={handleFileChange}
        onSubmit={actions.handleBulkRegister}
        refetchPos={refetchPos}
      />

      {/* Assign POS Modal */}
      <AssignPosModal
        open={state.modals.assignPos}
        onClose={actions.handleCloseAssignPos}
        formData={state.forms.assignData}
        onFormChange={handleAssignFormChange}
        onSubmit={actions.handleAssignPosDevices}
        state={state}
        refetchPos={refetchPos}
        schools={schools}
        availablePosDevices={availablePosDevices}
        selectedAssignPosId={state.selectedAssignPosId}
      />

      {/* Delete POS Modal */}
      <DeletePosModal
        open={state.modals.delete}
        onClose={actions.handleCloseDelete}
        // onConfirm={actions.handleDeletePos}
        refetchPos={refetchPos}
        state={state}
      />

      <DeactivatePOSModal
        state={state}
        open={state.modals.deactivate}
        onClose={actions.handleCloseDeactivatePOS}
        // onConfirm={actions.handleDeleteWristband}
        refetchWristbands={refetchPos}
      />
      <ActivatePOSModal
        state={state}
        open={state.modals.activate}
        onClose={actions.handleCloseActivatePOS}
        // onConfirm={actions.handleDeleteWristband}
        refetchWristbands={refetchPos}
      />
    </>
  );
};

export default PosModals;
