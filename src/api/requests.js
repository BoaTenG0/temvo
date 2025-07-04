import { useMutation, useQuery } from '@tanstack/react-query';
import { userService } from './index';

export const useGetParents = (filters) => {
  return useQuery({
    queryKey: ['parents', filters],
    queryFn: () => userService.getParents(filters)
  });
};

export const useAddParent = () => {
  return useMutation({ mutationFn: (data) => userService.addParent(data) });
};

export const useGetParentById = (parentId) => {
  return useQuery({
    queryKey: ['parent', parentId],
    queryFn: () => userService.getParentById(parentId)
  });
};
export const useGetAllTransactionBySchool = (filters, schoolId) => {
  return useQuery({
    queryKey: ['getAllTransactionBySchool', filters, schoolId],
    queryFn: () => userService.getAllTransactionBySchool(filters, schoolId)
  });
};
export const useGetAllVendorsBySchool = (filters, schoolId) => {
  return useQuery({
    queryKey: ['getAllVendorsBySchool', filters, schoolId],
    queryFn: () => userService.getAllVendorsBySchool(filters, schoolId)
  });
};
export const useGetStudentsBySchool = (filters, schoolId) => {
  return useQuery({
    queryKey: ['getStudentsBySchool', filters, schoolId],
    queryFn: () => userService.getStudentsBySchool(filters, schoolId)
  });
};

export const useDeleteParent = () => {
  return useMutation({ mutationFn: (parentId) => userService.deleteParent(parentId) });
};

export const useAssignWards = (parentId) => {
  return useMutation({ mutationFn: (data) => userService.assignWards(data, parentId) });
};

export const useGetWards = (parentId) => {
  return useQuery({
    queryKey: ['wards', parentId],
    queryFn: () => userService.getWards(parentId)
  });
};

export const useGetParentBySchoolIdd = (filters, schoolId) => {
  return useQuery({
    queryKey: ['getParentBySchoolId', filters, schoolId],
    queryFn: () => userService.getParentBySchoolId(filters, schoolId)
  });
};

export const useGetPOS = (filters) => {
  return useQuery({
    queryKey: ['pos', filters],
    queryFn: () => userService.getPOS(filters)
  });
};

export const useCreatePOS = () => {
  return useMutation({ mutationFn: (data) => userService.createPOS(data) });
};

export const useBulkUploadPOS = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadPOS(data) });
};

export const useAutoAssignToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.autoAssignToSchool(data) });
};

export const useAssignToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.assignToSchool(data) });
};

export const useDeactivatePOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.deactivatePOS(data, posId) });
};

export const useActivatePOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.activatePOS(data, posId) });
};

export const useReAssignPOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.reAssignPOS(data, posId) });
};

export const useUnassignPOS = () => {
  return useMutation({ mutationFn: (data) => userService.unassignPOS(data) });
};

export const useGetPOSForSchool = (filters, schoolId) => {
  return useQuery({
    queryKey: ['pos-for-school', filters, schoolId],
    queryFn: () => userService.getPOSForSchool(filters, schoolId)
  });
};

export const useGetPOSDeviceById = (posId) => {
  return useQuery({
    queryKey: ['pos-device', posId],
    queryFn: () => userService.getPOSDeviceById(posId)
  });
};

export const useGetBulkUploadCredentials = (posId) => {
  return useQuery({
    queryKey: ['bulk-upload-credentials', posId],
    queryFn: () => userService.getBulkUploadCredentials(posId)
  });
};

export const useDeletePOSDevice = (posId) => {
  return useMutation({ mutationFn: () => userService.deletePOSDevice(posId) });
};

export const useGetWristbands = (filters) => {
  return useQuery({
    queryKey: ['wristbands', filters],
    queryFn: () => userService.getWristbands(filters)
  });
};

export const useGetWristbandById = (wristbandId) => {
  return useQuery({
    queryKey: ['wristband', wristbandId],
    queryFn: () => userService.getWristbandById(wristbandId)
  });
};

export const useAssignWristbandToStudent = () => {
  return useMutation({ mutationFn: (data) => userService.assignWristbandToStudent(data) });
};

export const useAssignWristbandToSchool = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.assignWristbandToSchool(data, wristbandId) });
};

export const useUnassignWristbandFromStudent = (studentId) => {
  return useMutation({ mutationFn: (data) => userService.unassignWristbandFromStudent(data, studentId) });
};

export const useCreateWristband = () => {
  return useMutation({
    mutationFn: (data) => userService.createWristband(data)
  });
};

export const useBulkUploadWristbands = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadWristbands(data) });
};

export const useAutoAssignWristbandsToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.autoAssignWristbandsToSchool(data) });
};

export const useAssignBulkWristbandsToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.assignBulkWristbandsToSchool(data) });
};

export const useDeactivateWristband = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.deactivateWristband(data, wristbandId) });
};

export const useDeleteWristband = (wristbandId) => {
  return useMutation({ mutationFn: () => userService.deleteWristband(wristbandId) });
};

export const useActivateWristband = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.activateWristband(data, wristbandId) });
};

export const useGetWristbandsForCurrentSchool = (schoolId, filters) => {
  return useQuery({
    queryKey: ['wristbands-for-school', schoolId, filters],
    queryFn: () => userService.getWristbandsForCurrentSchool(schoolId, filters)
  });
};

export const useGetUnassignedWristbands = () => {
  return useQuery({
    queryKey: ['unassigned-wristbands'],
    queryFn: () => userService.getUnassignedWristbands()
  });
};

export const useGetGeneralSchoolById = (schoolId) => {
  return useQuery({
    queryKey: ['general-school', schoolId],
    queryFn: () => userService.getGeneralSchoolById(schoolId)
  });
};

export const useCreateGeneralSchool = () => {
  return useMutation({ mutationFn: (data) => userService.createGeneralSchool(data) });
};

export const useBulkUploadGeneralSchool = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadGeneralSchool(data) });
};

export const useReAssignSchoolAdmin = (schoolId) => {
  return useMutation({ mutationFn: (data) => userService.ReAssignSchoolAdmin(data, schoolId) });
};

export const useDeleteGenearalSchool = (schoolId) => {
  return useMutation({ mutationFn: () => userService.deleteGenearalSchool(schoolId) });
};

export const useGetGeneralSchool = (filters) => {
  return useQuery({
    queryKey: ['general-school', filters],
    queryFn: () => userService.getGeneralSchool(filters)
  });
};

export const useGetAllWallets = (filters) => {
  return useQuery({
    queryKey: ['all-wallets', filters],
    queryFn: () => userService.getAllWallets(filters)
  });
};

export const useGetUsers = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters)
  });
};

export const useCreateUser = () => {
  return useMutation({ mutationFn: (data) => userService.createUser(data) });
};

export const useBulkDeleteUsers = () => {
  return useMutation({ mutationFn: (data) => userService.bulkDeleteUsers(data) });
};

export const useGetUnassignedAdmins = () => {
  return useQuery({
    queryKey: ['unassigned-admins'],
    queryFn: () => userService.getUnassignedAdmins()
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile()
  });
};

export const useChangePassword = () => {
  return useMutation({ mutationFn: (data) => userService.changePassword(data) });
};

export const useEditUser = (userId) => {
  return useMutation({ mutationFn: (data) => userService.editUser(data, userId) });
};

export const useDeleteUser = (userId) => {
  return useMutation({ mutationFn: () => userService.deleteUser(userId) });
};

export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId)
  });
};

export const useGetRoles = (filters) => {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: () => userService.getRoles(filters)
  });
};

export const useCreateRole = () => {
  return useMutation({ mutationFn: (data) => userService.createRole(data) });
};

export const useGetRoleById = (roleId) => {
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: () => userService.getRoleById(roleId)
  });
};

export const useEditRole = (roleId) => {
  return useMutation({ mutationFn: (data) => userService.editRole(data, roleId) });
};

export const useDeleteRole = (roleId) => {
  return useMutation({ mutationFn: () => userService.deleteRole(roleId) });
};

export const useGetPermissions = (filters) => {
  return useQuery({
    queryKey: ['permissions', filters],
    queryFn: () => userService.getPermissions(filters)
  });
};

export const useCreatePermission = () => {
  return useMutation({ mutationFn: (data) => userService.createPermission(data) });
};

export const useBulkCreatePermission = () => {
  return useMutation({ mutationFn: (data) => userService.bulkCreatePermission(data) });
};

export const useGetPermissionById = (permissionId) => {
  return useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => userService.getPermissionById(permissionId)
  });
};

export const useUpdatePermission = (permissionId) => {
  return useMutation({ mutationFn: (data) => userService.updatePermission(data, permissionId) });
};

export const useDeletePermission = (permissionId) => {
  return useMutation({ mutationFn: () => userService.deletePermission(permissionId) });
};

export const useGetBulkUploadJobStatus = (jobId) => {
  return useQuery({
    queryKey: ['bulk-upload-status', jobId],
    queryFn: () => userService.getBulkUploadJobStatus(jobId)
  });
};

// students
export const useGetStudents = (filters) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => userService.getStudents(filters)
  });
};
export const useGetStudentById = (studentId) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => userService.getStudentById(studentId)
  });
};
export const useCreateStudent = () => {
  return useMutation({ mutationFn: (data) => userService.createStudent(data) });
};
export const useBulkUploadStudents = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadStudents(data) });
};
export const useEditStudent = () => {
  return useMutation({ mutationFn: (data) => userService.updateStudent(data) });
};

export const useDeleteStudent = () => {
  return useMutation({ mutationFn: (studentId) => userService.deleteStudent(studentId) });
};

// bulk delete students
export const useBulkDeleteStudents = () => {
  return useMutation({ mutationFn: (data) => userService.bulkDeleteStudents(data) });
};
export const useGetStudentBySchoolId = (filters, schoolId) => {
  return useQuery({
    queryKey: ['students-by-school', filters, schoolId],
    queryFn: () => userService.getStudentsBySchool(filters, schoolId)
  });
};

export const useUpdateStudentStatus = () => {
  return useMutation({ mutationFn: (data) => userService.updateStudentStatus(data) });
};

export const useReassignStudent = () => {
  return useMutation({ mutationFn: (data) => userService.reassignStudentToSchool(data) });
};

// Function to handle creating a new vendor
export const useCreateVendor = () => {
  return useMutation({ mutationFn: (data) => userService.createVendors(data) });
};

// Function to handle bulk uploading vendors
export const useBulkUploadVendors = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadVendors(data) });
};

export const useGetVendorById = (vendorId) => {
  return useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => userService.getVendorById(vendorId)
  });
};
export const useEditVendor = (vendorId) => {
  return useMutation({ mutationFn: (data) => userService.editVendor(data, vendorId) });
};
export const useDeleteVendor = (vendorId) => {
  return useMutation({ mutationFn: () => userService.deleteVendor(vendorId) });
};

export const useAssignPOStoVendor = () => {
  return useMutation({ mutationFn: (data) => userService.assignPOStoVendor(data) });
};

export const useGetPOSDeviceByVendorId = (vendorId) => {
  return useQuery({
    queryKey: ['pos-devices', vendorId],
    queryFn: () => userService.getPOSDeviceByVendorId(vendorId)
  });
};

export const useGetVendors = (filters, vendorId) => {
  return useQuery({
    queryKey: ['vendors', filters, vendorId],
    queryFn: () => userService.getVenders(filters, vendorId)
  });
};
export const useGetAllVendors = (filters) => {
  return useQuery({
    queryKey: ['vendors', filters],
    queryFn: () => userService.getAllVenders(filters)
  });
};

export const useGetDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => userService.getDashboardOverview()
  });
};

export const useActivateWallet = () => {
  return useMutation({ mutationFn: (data) => userService.activateWallet(data) });
};

export const useDeactivateWallet = () => {
  return useMutation({ mutationFn: (data) => userService.deActivateWallet(data) });
};

export const useGetUserWalletTransactions = (filters, userId) => {
  return useQuery({
    queryKey: ['wallet-transactions', filters, userId],
    queryFn: () => userService.getUserWalletTransactions(filters, userId)
  });
};

export const useGetWalletByUserId = (userId) => {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => userService.getWalletByUserId(userId)
  });
};
