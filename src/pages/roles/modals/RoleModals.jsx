import React from 'react';
import NewRoleModal from './NewRoleModal';
import EditRoleModal from './EditRoleModal';
import DeleteRoleModal from './DeleteRoleModal';
import ViewRoleModal from './ViewRoleModal';

const RoleModals = ({ state, actions, onFormChange, refetchRoles, permissions }) => {
  return (
    <>
      {/* New Role Modal */}
      <NewRoleModal
        open={state.modals.newRole}
        onClose={actions.handleCloseNewRole}
        formData={state.forms.newRole}
        onFormChange={onFormChange}
        refetchRoles={refetchRoles}
        permissions={permissions}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        open={state.modals.editRole}
        onClose={actions.handleCloseEdit}
        formData={state.forms.editRole}
        onFormChange={onFormChange}
        refetchRoles={refetchRoles}
        permissions={permissions}
      />

      {/* Delete Role Modal */}
      <DeleteRoleModal
        open={state.modals.deleteRole}
        onClose={actions.handleCloseDelete}
        formData={state.forms.deleteRole}
        refetchRoles={refetchRoles}
      />

      {/* View Role Modal */}
      <ViewRoleModal
        open={state.modals.viewRole}
        onClose={actions.handleCloseView}
        formData={state.forms.viewRole}
        permissions={permissions}
      />
    </>
  );
};

export default RoleModals;
