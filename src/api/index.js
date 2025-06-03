import axios from 'axios';
import apiClient from './apiClient';
const baseURL = process.env.BASE_URL;

// Login
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Verify Otp
export const verifyOtp = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/verify-otp`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// send otp
export const sendOtp = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/send-otp`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// refresh token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// forgot password- verify otp
export const forgotPassword = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/forgot-password`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// forgot password - send otp
export const forgotPasswordSendOtp = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/forgot-password-send-otp`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

// forgot password - reset password
export const forgotPasswordReset = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/forgot-password-reset`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    throw new Error('Network error. Please try again.');
  }
};

const Parents = {
  Parents: '/parents'
};
const Schools = {
  default: '/schools'
};
const POS = {
  Default: '/pos-devices',
  BulkUpload: '/pos-devices/bulk-upload',
  AutoAssignToSchool: '/pos-devices/auto-assign-to-school',
  AssignToSchool: '/pos-devices/assign-to-school',
  UnassignPOS: '/pos-devices/unassign'
};

// API endpoints

const Wristbands = {
  default: '/wristbands',
  BulkUpload: '/wristbands/bulk-upload',
  AutoAssignToSchool: '/wristbands/auto-assign-to-school',
  AssignBulkToSchool: '/wristbands/assign-bulk-school'
};

// Get Parents
const getParents = async (filters, parentId) => {
  const url = `${Parents.Parents}/${parentId}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size } = filters;
    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
  }

  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// Add Parent
const addParent = async (data) => {
  return apiClient.post({ url: Parents.Parents, data });
};

// Get Parent by Id
const getParentById = async (parentId) => {
  return apiClient.get({ url: `${Parents.Parents}/${parentId}` });
};

// Delete parent
const deleteParent = async (parentId) => {
  return apiClient.delete({ url: `${Parents.Parents}/${parentId}` });
};

// Assign wards
const assignWards = async (data, parentId) => {
  return apiClient.post({ url: `${Parents.Parents}/${parentId}/assign-wards`, data });
};

// Get wards
const getWards = async (parentId) => {
  return apiClient.get({ url: `${Parents.Parents}/${parentId}/wards` });
};

// Get school by id
const getSchoolById = async (schoolId) => {
  return apiClient.get({ url: `${Parents.Parents}/school/${schoolId}` });
};
const getGeneralSchoolById = async (schoolId) => {
  return apiClient.get({ url: `${Schools.default}/${schoolId}` });
};
const getGeneralSchool = async () => {
  return apiClient.get({ url: Schools.default });
};

const createGeneralSchool = async (data) => {
  return apiClient.post({ url: Schools.default, data });
};

const bulkUploadGeneralSchool = async (data) => {
  return apiClient.post({ url: `${Schools.default}/bulk-upload`, data });
};

const ReAssignSchoolAdmin = async (data, schoolId) => {
  return apiClient.post({ url: `${Schools.default}/${schoolId}/reassign-admin`, data });
};

const deleteGenearalSchool = async (schoolId) => {
  return apiClient.delete({ url: `${Schools.default}/${schoolId}` });
};

// Get all POS
const getPOS = async (filters) => {
  const url = POS.Default;
  const params = new URLSearchParams();

  if (filters) {
    const { page, search, unassign, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (search !== undefined) params.append('search', search);
    if (unassign !== undefined) params.append('unassigned', String(unassign));
    if (sort !== undefined) params.append('sort', sort);
  }

  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// create POS device
const createPOS = async (data) => {
  return apiClient.post({ url: POS.Default, data });
};

// bulk upload
const bulkUploadPOS = async (data) => {
  return apiClient.post({ url: POS.BulkUpload, data });
};

// auto assign to school
const autoAssignToSchool = async (data) => {
  return apiClient.post({ url: POS.AutoAssignToSchool, data });
};

// assign to school
const assignToSchool = async (data) => {
  return apiClient.post({ url: POS.AssignToSchool, data });
};

// deactivate POS device
const deactivatePOS = async (data, posId) => {
  return apiClient.patch({ url: `${POS.Default}/${posId}/deactivate`, data });
};

// activate POS device
const activatePOS = async (data, posId) => {
  return apiClient.patch({ url: `${POS.Default}/${posId}/activate`, data });
};

// reassign device
const reAssignPOS = async (data, posId) => {
  return apiClient.patch({ url: `${POS.Default}/${posId}/reassign`, data });
};

// unassign device
const unassignPOS = async (data) => {
  return apiClient.patch({ url: POS.UnassignPOS, data });
};

// Get POS device for school
const getPOSForSchool = async (schoolId) => {
  return apiClient.get({ url: `${POS.Default}/${schoolId}/by-school` });
};

const getPOSDeviceById = async (posId) => {
  return apiClient.get({ url: `${POS.Default}/${posId}` });
};

// Get bulk upload credentials
const getBulkUploadCredentials = async (posId) => {
  return apiClient.get({ url: `${POS.BulkUpload}/${posId}/credentials` });
};

// delete POS device
const deletePOSDevice = async (posId) => {
  return apiClient.delete({ url: `${POS.Default}/${posId}` });
};

// Wristbands
const getWristbands = async (filters) => {
  const url = Wristbands.default;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, unassign, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);
    if (unassign !== undefined) params.append('unassigned', String(unassign));

    // Append each sort value if it's an array
    if (Array.isArray(sort)) {
      sort.forEach((sortField) => {
        params.append('sort', sortField);
      });
    } else if (sort) {
      // If it's a single string, just append it
      params.append('sort', sort);
    }
  }

  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// get wristband by id
const getWristbandById = async (wristbandId) => {
  return apiClient.get({ url: `${Wristbands.default}/${wristbandId}` });
};

//Assign wristband to student
const assignWristbandToStudent = async (data, wristbandId) => {
  return apiClient.post({ url: `${Wristbands.default}/${wristbandId}/assign-student`, data });
};

// Assign wristband to school
const assignWristbandToSchool = async (data, wristbandId) => {
  return apiClient.post({ url: `${Wristbands.default}/${wristbandId}/assign-school`, data });
};

//Unassign wristband from student
const unassignWristbandFromStudent = async (data, studentId) => {
  return apiClient.post({ url: `${Wristbands.default}/unassign-student/${studentId}`, data });
};

const createWristband = async (data) => {
  return apiClient.post({ url: Wristbands.default, data });
};

const bulkUploadWristbands = async (data) => {
  return apiClient.post({ url: Wristbands.BulkUpload, data });
};

const autoAssignWristbandsToSchool = async (data) => {
  return apiClient.post({ url: Wristbands.AutoAssignToSchool, data });
};

const assignBulkWristbandsToSchool = async (data) => {
  return apiClient.post({ url: Wristbands.AssignBulkToSchool, data });
};

// deactivate wristband
const deactivateWristband = async (data, wristbandId) => {
  return apiClient.patch({ url: `${Wristbands.default}/${wristbandId}/deactivate`, data });
};

// delete wristband
const deleteWristband = async (wristbandId) => {
  return apiClient.delete({ url: `${Wristbands.default}/${wristbandId}` });
};

// activate wristband
const activateWristband = async (data, wristbandId) => {
  return apiClient.patch({ url: `${Wristbands.default}/${wristbandId}/activate`, data });
};

// get wristband for current school
const getWristbandsForCurrentSchool = async (schoolId) => {
  return apiClient.get({ url: `${Wristbands.default}/${schoolId}/by-school` });
};

// get all unassigned wristbands
const getUnassignedWristbands = async () => {
  return apiClient.get({ url: `${Wristbands.default}/unassigned` });
};

export const userService = {
  getParents,
  addParent,
  getParentById,
  deleteParent,
  assignWards,
  getWards,
  getSchoolById,
  getPOS,
  createPOS,
  bulkUploadPOS,
  autoAssignToSchool,
  assignToSchool,
  deactivatePOS,
  activatePOS,
  reAssignPOS,
  unassignPOS,
  getPOSForSchool,
  getPOSDeviceById,
  getBulkUploadCredentials,
  deletePOSDevice,
  getWristbands,
  getWristbandById,
  assignWristbandToStudent,
  assignWristbandToSchool,
  unassignWristbandFromStudent,
  createWristband,
  bulkUploadWristbands,
  autoAssignWristbandsToSchool,
  assignBulkWristbandsToSchool,
  deactivateWristband,
  deleteWristband,
  activateWristband,
  getWristbandsForCurrentSchool,
  getUnassignedWristbands,
  getGeneralSchoolById,
  createGeneralSchool,
  bulkUploadGeneralSchool,
  ReAssignSchoolAdmin,
  deleteGenearalSchool,
  getGeneralSchool
};
