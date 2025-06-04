import React from 'react';
import NewPermissionModal from './NewPermissionModal';
import EditPermissionModal from './EditPermissionModal';
import DeletePermissionModal from './DeletePermissionModal';
import ViewPermissionModal from './ViewPermissionModal';

const PermissionModals = ({ state, actions, onFormChange, refetchPermissions }) => {
  return (
    <>
      {/* New Permission Modal */}
      <NewPermissionModal
        open={state.modals.newPermission}
        onClose={actions.handleCloseNewPermission}
        formData={state.forms.newPermission}
        onFormChange={onFormChange}
        refetchPermissions={refetchPermissions}
      />

      {/* Edit Permission Modal */}
      <EditPermissionModal
        open={state.modals.editPermission}
        onClose={actions.handleCloseEditPermission}
        formData={state.forms.editPermission}
        onFormChange={onFormChange}
        refetchPermissions={refetchPermissions}
      />

      {/* Delete Permission Modal */}
      <DeletePermissionModal
        open={state.modals.deletePermission}
        onClose={actions.handleCloseDeletePermission}
        formData={state.forms.deletePermission}
        refetchPermissions={refetchPermissions}
      />

      {/* View Permission Modal */}
      <ViewPermissionModal
        open={state.modals.viewPermission}
        onClose={actions.handleCloseViewPermission}
        formData={state.forms.viewPermission}
      />
    </>
  );
};

export default PermissionModals;
