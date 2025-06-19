/* eslint-disable no-unused-vars */
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
const Dashboard = {
  default: '/dashboard/overview'
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

// wallet
const Wallet = {
  default: '/wallets'
};
const Vendors = {
  default: '/vendors'
};

const Users = {
  default: '/users',
  changePassword: '/users/change-password',
  bulkDelete: '/users/bulk-delete',
  unAssignedAdmins: '/users/school-admins/unassigned',
  profile: '/users/me'
};

const Roles = {
  default: '/roles'
};

const Permissions = {
  default: '/permissions'
};

const Student = {
  default: '/students'
};
// Get Parents
const getParents = async (filters) => {
  const url = `${Parents.Parents}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search } = filters;
    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);
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

const getDashboardOverview = async () => {
  return apiClient.get({ url: `${Dashboard.default}` });
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
const getParentBySchoolId = async (filters = {}, schoolId) => {
  const url = `${Parents.Parents}/school/${schoolId}`;
  const params = new URLSearchParams();

  const { page, size, search, from, to } = filters;

  const entries = {
    page,
    size,
    search,
    from,
    to
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};

const getGeneralSchoolById = async (schoolId) => {
  return apiClient.get({ url: `${Schools.default}/${schoolId}` });
};
const getGeneralSchool = async (filters) => {
  const url = Schools.default;
  const filter = {
    from: filters?.from,
    to: filters?.to
  };
  const pageable = {
    page: filters?.page || 0,
    size: filters?.size || 10,
    sort: filters?.sort || ['desc']
  };
  const params = new URLSearchParams({
    filter: JSON.stringify(filter),
    pageable: JSON.stringify(pageable),
    search: filters?.search || ''
  });
  return apiClient.get({ url: `${url}?${params.toString()}` });
};

const createGeneralSchool = async (data) => {
  return apiClient.post({ url: Schools.default, data });
};

const bulkUploadGeneralSchool = async (data) => {
  return apiClient.postFormData({ url: `${Schools.default}/bulk-upload`, data });
};

const ReAssignSchoolAdmin = async (data, schoolId) => {
  return apiClient.post({ url: `${Schools.default}/${schoolId}/reassign-admin`, data });
};

const deleteGenearalSchool = async (schoolId) => {
  return apiClient.delete({ url: `${Schools.default}/${schoolId}` });
};

// Get all POS
const getPOS = async (filters = {}) => {
  const url = POS.Default;
  const params = new URLSearchParams();

  const { page, search, unassign, sort, schoolId, status, from, to } = filters;

  const entries = {
    page,
    search,
    unassigned: unassign, // renamed for API
    schoolId,
    status,
    from,
    to
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  // Handle sort (array or string)
  if (Array.isArray(sort)) {
    sort.forEach((s) => {
      if (s) params.append('sort', s);
    });
  } else if (sort) {
    params.append('sort', sort);
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
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
const getPOSForSchool = async (filters, schoolId) => {
  const url = `${POS.Default}/${schoolId}/by-school`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);

    // if (Array.isArray(sort)) {
    //   sort.forEach((sortField) => {
    //     params.append('sort', sortField);
    //   });
    // } else if (sort) {
    //   params.append('sort', sort);
    // }
  }

  return apiClient.get({ url: `${url}?${params.toString()}` });
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
  //   const filter = {};

  const pageable = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    sort: Array.isArray(filters.sort) ? filters.sort : [filters.sort || 'desc']
  };
  const filter = {
    search: filters.search || '',
    schoolId: filters.schoolId || '',
    from: filters.from || '',
    to: filters.to || ''
  };
  // Only add non-empty filter
  if (Object.keys(filter).length > 0) {
    params.append('filter', JSON.stringify(filter));
  }

  if (Object.keys(pageable).length > 0) {
    params.append('pageable', JSON.stringify(pageable));
  }
  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// get wristband by id
const getWristbandById = async (wristbandId) => {
  return apiClient.get({ url: `${Wristbands.default}/${wristbandId}` });
};

//Assign wristband to student
const assignWristbandToStudent = async (data) => {
  return apiClient.post({ url: `${Wristbands.default}/${data?.wristbandId}/assign-student`, data: { studentId: data?.studentId } });
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
  return apiClient.postFormData({ url: Wristbands.BulkUpload, data });
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
const getWristbandsForCurrentSchool = async (schoolId, filters = {}) => {
  const url = `${Wristbands.default}/${schoolId}/by-school`;
  const params = new URLSearchParams();

  // Build filter object with only valid values
  const filter = {};
  if (filters.status) filter.status = filters.status;
  if (filters.from) filter.from = filters.from;
  if (filters.to) filter.to = filters.to;

  // Build pageable object
  const pageable = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    sort: Array.isArray(filters.sort) ? filters.sort : [filters.sort || 'desc']
  };

  // Only add non-empty filter
  if (Object.keys(filter).length > 0) {
    params.append('filter', JSON.stringify(filter));
  }

  params.append('pageable', JSON.stringify(pageable));

  // Optionally add search
  if (filters.search) {
    params.append('search', filters.search);
  }

  const finalUrl = `${url}?${params.toString()}`;
  return apiClient.get({ url: finalUrl });
};

// get all unassigned wristbands
const getUnassignedWristbands = async () => {
  return apiClient.get({ url: `${Wristbands.default}/unassigned` });
};

// get all wallets
const getAllWallets = async (filters = {}) => {
  const url = Wallet.default;
  const params = new URLSearchParams();

  // 🔹 Build filter object with only valid values
  const filter = {};
  if (filters.status) filter.status = filters.status;
  if (filters.from) filter.from = filters.from;
  if (filters.to) filter.to = filters.to;

  if (Object.keys(filter).length > 0) {
    params.append('filter', JSON.stringify(filter));
  }

  // 🔹 Build pageable object
  const pageable = {
    page: filters.page ?? 0,
    size: filters.size ?? 10,
    sort: Array.isArray(filters.sort) ? filters.sort : [filters.sort || 'desc']
  };
  params.append('pageable', JSON.stringify(pageable));

  // 🔹 Optionally add search
  if (filters.search) {
    params.append('search', filters.search);
  }

  const finalUrl = `${url}?${params.toString()}`;
  return apiClient.get({ url: finalUrl });
};

const activateWallet = async (data) => {
  return apiClient.patch({
    url: `${Wallet.default}/${data?.userId}/activate`,
    params: {
      performedByUserId: data?.performedByUserId
    }
  });
};
const deActivateWallet = async (data) => {
  return apiClient.patch({
    url: `${Wallet.default}/${data?.userId}/deactivate`,
    params: {
      performedByUserId: data?.performedByUserId
    }
  });
};

const getWalletByUserId = async (userId) => {
  return apiClient.get({ url: `${Wallet.default}/${userId}` });
};

const getUserWalletTransactions = async (filters, userId) => {
  const url = `${Wallet.default}/${userId}/transactions`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort, channel, provider, amountMax, amountMin, from, to, status, type } = filters;

    // Clean object with only meaningful values
    const entries = {
      page,
      size,
      search,
      channel,
      provider,
      amountMax,
      amountMin,
      from,
      to,
      status,
      type
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    // Optional: handle sort (array or string)
    if (Array.isArray(sort)) {
      sort.forEach((s) => {
        if (s) params.append('sort', s);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};

const getAllTransactionBySchool = async (filters, schoolId) => {
  const url = `${Wallet.default}/transactions/by-school/${schoolId}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort, channel, provider, amountMax, amountMin, from, to, status, type } = filters;

    const entries = {
      page,
      size,
      search,
      channel,
      provider,
      amountMax,
      amountMin,
      from,
      to,
      status,
      type
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    // Handle sort (array or single string)
    if (Array.isArray(sort)) {
      sort.forEach((s) => {
        if (s) params.append('sort', s);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};

const getAllVendorsBySchool = async (filters, schoolId) => {
  const url = `${Vendors.default}/school/${schoolId}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);
    // if (channel !== undefined) params.append('channel', channel);
    // if (provider !== undefined) params.append('provider', provider);
    // if (amountMax !== undefined) params.append('amountMax', amountMax);
    // if (amountMin !== undefined) params.append('amountMin', amountMin);
    // if (from !== undefined) params.append('from', from);
    // if (to !== undefined) params.append('to', to);
    // if (status !== undefined) params.append('status', status);
    // if (type !== undefined) params.append('type', type);

    // if (Array.isArray(sort)) {
    //   sort.forEach((sortField) => {
    //     params.append('sort', sortField);
    //   });
    // } else if (sort) {
    //   params.append('sort', sort);
    // }
  }

  return apiClient.get({ url: `${url}?${params.toString()}` });
};

const getStudentsBySchool = async (filters, schoolId) => {
  const url = `${Student.default}/school/${schoolId}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, status, from, to, className, sort } = filters;

    const entries = {
      page,
      size,
      search,
      status,
      from,
      to,
      className // 👈 remap className to `class`
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    // Handle sort (single or array)
    if (Array.isArray(sort)) {
      sort.forEach((s) => {
        if (s) params.append('sort', s);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};

// create vendors
const createVendors = async (data) => {
  return apiClient.post({ url: Vendors.default, data });
};
const createBulkVendors = async (data) => {
  return apiClient.postFormData({ url: `${Vendors.default}/bulk-upload`, data });
};

const getVenders = async (filters, vendorId) => {
  const url = `${Vendors.default}/school/${vendorId}`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sortDirection, from, to } = filters;

    const entries = {
      page,
      size,
      search,
      from,
      to
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    // Handle sortDirection (single string or array)
    if (Array.isArray(sortDirection)) {
      sortDirection.forEach((s) => {
        if (s) params.append('sort', s);
      });
    } else if (sortDirection) {
      params.append('sort', sortDirection);
    }
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};
const getAllVenders = async (filters) => {
  const url = Vendors.default;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sortDirection, from, to } = filters;

    const entries = {
      page,
      size,
      search,
      from,
      to
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    // Handle sortDirection (single string or array)
    if (Array.isArray(sortDirection)) {
      sortDirection.forEach((s) => {
        if (s) params.append('sort', s);
      });
    } else if (sortDirection) {
      params.append('sort', sortDirection);
    }
  }

  const finalUrl = `${url}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient.get({ url: finalUrl });
};

const editVendor = async (data, userId) => {
  return apiClient.patch({ url: `${Vendors.default}/${userId}`, data });
};

// assign pos to vendor
const assignPOStoVendor = (data) => {
  return apiClient.post({ url: `${Vendors.default}/${data?.vendorId}/assign-pos`, data: { posId: data?.posId } });
};

// get vendor by id
const getVendorById = async (vendorId) => {
  return apiClient.get({ url: `${Vendors.default}/${vendorId}` });
};
const deleteVendor = async (vendorId) => {
  return apiClient.delete({ url: `${Vendors.default}/${vendorId}` });
};
const getPOSDeviceByVendorId = async (vendorId) => {
  return apiClient.get({ url: `${Vendors.default}/${vendorId}/pos-devices` });
};

const bulkUploadVendors = async (data) => {
  return apiClient.postFormData({ url: `${Vendors.default}/bulk-upload`, data });
};

// users
const getUsers = async (filters = {}) => {
  const url = Users.default;
  const params = new URLSearchParams();

  const { page = 0, size = 10, sort = ['id,desc'], search, from, to, role } = filters;

  // Only append if value exists
  if (search) params.append('search', search);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (role) params.append('role', role);

  const pageable = {
    page,
    size,
    sort: Array.isArray(sort) ? sort : [sort]
  };

  params.append('pageable', JSON.stringify(pageable));

  const finalUrl = `${url}?${params.toString()}`;
  return apiClient.get({ url: finalUrl });
};

// create user
const createUser = async (data) => {
  return apiClient.post({ url: Users.default, data });
};

// bulk delete users
const bulkDeleteUsers = async (data) => {
  return apiClient.post({ url: Users.bulkDelete, data });
};

// get unassigned admins
const getUnassignedAdmins = async () => {
  return apiClient.get({ url: Users.unAssignedAdmins });
};

// get user profile
const getProfile = async () => {
  return apiClient.get({ url: Users.profile });
};

// change password
const changePassword = async (data) => {
  return apiClient.post({ url: Users.changePassword, data });
};

// edit user
const editUser = async (data, userId) => {
  return apiClient.patch({ url: `${Users.default}/${userId}`, data });
};

// delete user
const deleteUser = async (userId) => {
  return apiClient.delete({ url: `${Users.default}/${userId}` });
};

// get user by id
const getUserById = async (userId) => {
  return apiClient.get({ url: `${Users.default}/${userId}` });
};

// roles
const getRoles = async (filters) => {
  const url = Roles.default;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);

    if (Array.isArray(sort)) {
      sort.forEach((sortField) => {
        params.append('sort', sortField);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }
  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// create role
const createRole = async (data) => {
  return apiClient.post({ url: Roles.default, data });
};

// get role by id
const getRoleById = async (roleId) => {
  return apiClient.get({ url: `${Roles.default}/${roleId}` });
};

// edit role
const editRole = async (data, roleId) => {
  return apiClient.patch({ url: `${Roles.default}/${roleId}`, data });
};

// delete role
const deleteRole = async (roleId) => {
  return apiClient.delete({ url: `${Roles.default}/${roleId}` });
};

// permissions
const getPermissions = async (filters) => {
  const url = Permissions.default;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);

    if (Array.isArray(sort)) {
      sort.forEach((sortField) => {
        params.append('sort', sortField);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }
  return apiClient.get({ url: `${url}?${params.toString()}` });
};

// create permission
const createPermission = async (data) => {
  return apiClient.post({ url: Permissions.default, data });
};

// bulk upload
const bulkCreatePermission = async (data) => {
  return apiClient.post({ url: `${Permissions.default}/bulk-upload`, data });
};

// get permission by id
const getPermissionById = async (permissionId) => {
  return apiClient.get({ url: `${Permissions.default}/${permissionId}` });
};

// update permission

const updatePermission = async (permissionId) => {
  return apiClient.patch({ url: `${Permissions.default}/${permissionId}` });
};

// delete permission
const deletePermission = async (permissionId) => {
  return apiClient.delete({ url: `${Permissions.default}/${permissionId}` });
};

// get bulk upload status
const getBulkUploadJobStatus = async (jobId) => {
  return apiClient.get({ url: `${Permissions.default}/bulk-upload/status/${jobId}` });
};

// students
const getStudents = async (filters) => {
  const url = `${Student.default}/search`;
  const params = new URLSearchParams();

  if (filters) {
    const { page, size, search, sort } = filters;

    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (search !== undefined) params.append('search', search);

    if (Array.isArray(sort)) {
      sort.forEach((sortField) => {
        params.append('sort', sortField);
      });
    } else if (sort) {
      params.append('sort', sort);
    }
  }
  return apiClient.get({ url: `${url}?${params.toString()}` });
};

const getStudentById = async (studentId) => {
  return apiClient.get({ url: `${Student.default}/${studentId}` });
};

const createStudent = async (data) => {
  const { status, ...rest } = data;
  return apiClient.post({ url: Student.default, data: rest });
};

const bulkUploadStudents = async (data) => {
  return apiClient.postFormData({ url: `${Student.default}/bulk-upload`, data });
};

// delete student

const deleteStudent = async (studentId) => {
  return apiClient.delete({ url: `${Student.default}/${studentId}` });
};

// update student
const updateStudent = async (data) => {
  const { studentId, id, studentCode, userId, schoolId, wristbandId, walletBalance, createdAt, updatedBy, updatedAt, createdBy, ...rest } =
    data;

  return apiClient.patch({
    url: `${Student.default}/${studentId}`,
    data: rest
  });
};

// update student status
const updateStudentStatus = async (data) => {
  return apiClient.patch({
    url: `${Student.default}/${data?.studentId}/status`,
    params: { status: data?.status } // Send as query parameter
  });
};

//reassign student to another school
const reassignStudentToSchool = async (data) => {
  return apiClient.patch({ url: `${Student.default}/${data.studentId}/reassign`, data: { newSchoolId: data.newSchoolId } });
};

// list students by school
// const getStudentsBySchool = async (schoolId) => {
//   return apiClient.get({ url: `${Student.default}/school/${schoolId}` });
// };

// delete students in bulk
const bulkDeleteStudents = async (data) => {
  return apiClient.delete({ url: `${Student.default}/bulk-delete`, data });
};

export const userService = {
  getParents,
  addParent,
  getParentById,
  deleteParent,
  assignWards,
  getWards,
  getParentBySchoolId,
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
  getAllTransactionBySchool,
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
  getGeneralSchool,
  getAllWallets,
  getUsers,
  createUser,
  bulkDeleteUsers,
  getUnassignedAdmins,
  getProfile,
  changePassword,
  editUser,
  deleteUser,
  getUserById,
  getRoles,
  createRole,
  getRoleById,
  editRole,
  deleteRole,
  getPermissions,
  createPermission,
  bulkCreatePermission,
  getPermissionById,
  updatePermission,
  deletePermission,
  getBulkUploadJobStatus,
  getAllVendorsBySchool,
  bulkUploadVendors,
  getStudentsBySchool,
  getStudents,
  getStudentById,
  createStudent,
  bulkUploadStudents,
  deleteStudent,
  updateStudent,
  updateStudentStatus,
  reassignStudentToSchool,
  bulkDeleteStudents,
  getVenders,
  getAllVenders,
  getVendorById,
  createVendors,
  editVendor,
  deleteVendor,
  assignPOStoVendor,
  getPOSDeviceByVendorId,
  createBulkVendors,
  getDashboardOverview,
  deActivateWallet,
  activateWallet,
  getWalletByUserId,
  getUserWalletTransactions
};
