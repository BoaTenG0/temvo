import { createTheme } from '@mui/material/styles';

// Create a custom theme with neutral colors and accent highlights
export const theme = createTheme({
  palette: {
    primary: {
      main: '#546e7a' // Neutral blue-gray as primary
    },
    secondary: {
      main: '#26a69a' // Teal as accent color
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#37474f',
      secondary: '#546e7a'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem'
    },
    subtitle1: {
      fontSize: '0.9rem',
      color: '#546e7a'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});

// Role status options
export const ROLE_STATUS_OPTIONS = [
  { value: 'All', label: 'All Roles' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
];

// Permission status options
export const PERMISSION_STATUS_OPTIONS = [
  { value: 'All', label: 'All Permissions' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
];

// Table configuration
export const ROLES_TABLE_CONFIG = {
  defaultRowsPerPage: 20,
  rowsPerPageOptions: [10, 20, 50, 100]
};

export const PERMISSIONS_TABLE_CONFIG = {
  defaultRowsPerPage: 20,
  rowsPerPageOptions: [10, 20, 50, 100]
};

// Form validation schemas
export const ROLE_VALIDATION_SCHEMA = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s_-]+$/
  },
  description: {
    required: false,
    maxLength: 255
  }
};

export const PERMISSION_VALIDATION_SCHEMA = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s_.-]+$/
  },
  description: {
    required: false,
    maxLength: 255
  },
  resource: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  action: {
    required: true,
    minLength: 2,
    maxLength: 50
  }
};

// Common permission actions
export const PERMISSION_ACTIONS = [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'VIEW',
  'MANAGE',
  'EXECUTE',
  'APPROVE'
];

// Common resources
export const PERMISSION_RESOURCES = [
  'USER',
  'ROLE',
  'PERMISSION',
  'SCHOOL',
  'STUDENT',
  'TRANSACTION',
  'REPORT',
  'POS',
  'WRISTBAND',
  'DASHBOARD'
];

// Helper functions
export const formatRoleName = (name) => {
  return name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatPermissionName = (name) => {
  return name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
    case true:
      return 'success';
    case 'inactive':
    case false:
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'Active' : 'Inactive';
  }
  return status || 'Unknown';
};

// Search and filter utilities
export const filterRoles = (roles, filters) => {
  if (!roles) return [];

  return roles.filter(role => {
    const matchesSearch = !filters.search ||
      role.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      role.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'All' ||
      (filters.status === 'Active' && role.active) ||
      (filters.status === 'Inactive' && !role.active);

    return matchesSearch && matchesStatus;
  });
};

export const filterPermissions = (permissions, filters) => {
  if (!permissions) return [];

  return permissions.filter(permission => {
    const matchesSearch = !filters.search ||
      permission.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      permission.resource?.toLowerCase().includes(filters.search.toLowerCase()) ||
      permission.action?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'All' ||
      (filters.status === 'Active' && permission.active) ||
      (filters.status === 'Inactive' && !permission.active);

    return matchesSearch && matchesStatus;
  });
};

// Validation utilities
export const validateRoleForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Role name is required';
  } else if (formData.name.length < ROLE_VALIDATION_SCHEMA.name.minLength) {
    errors.name = `Role name must be at least ${ROLE_VALIDATION_SCHEMA.name.minLength} characters`;
  } else if (formData.name.length > ROLE_VALIDATION_SCHEMA.name.maxLength) {
    errors.name = `Role name must not exceed ${ROLE_VALIDATION_SCHEMA.name.maxLength} characters`;
  } else if (!ROLE_VALIDATION_SCHEMA.name.pattern.test(formData.name)) {
    errors.name = 'Role name can only contain letters, numbers, spaces, underscores, and hyphens';
  }

  if (formData.description && formData.description.length > ROLE_VALIDATION_SCHEMA.description.maxLength) {
    errors.description = `Description must not exceed ${ROLE_VALIDATION_SCHEMA.description.maxLength} characters`;
  }

  return errors;
};

export const validatePermissionForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Permission name is required';
  } else if (formData.name.length < PERMISSION_VALIDATION_SCHEMA.name.minLength) {
    errors.name = `Permission name must be at least ${PERMISSION_VALIDATION_SCHEMA.name.minLength} characters`;
  } else if (formData.name.length > PERMISSION_VALIDATION_SCHEMA.name.maxLength) {
    errors.name = `Permission name must not exceed ${PERMISSION_VALIDATION_SCHEMA.name.maxLength} characters`;
  } else if (!PERMISSION_VALIDATION_SCHEMA.name.pattern.test(formData.name)) {
    errors.name = 'Permission name can only contain letters, numbers, spaces, underscores, periods, and hyphens';
  }

  if (!formData.resource?.trim()) {
    errors.resource = 'Resource is required';
  }

  if (!formData.action?.trim()) {
    errors.action = 'Action is required';
  }

  if (formData.description && formData.description.length > PERMISSION_VALIDATION_SCHEMA.description.maxLength) {
    errors.description = `Description must not exceed ${PERMISSION_VALIDATION_SCHEMA.description.maxLength} characters`;
  }

  return errors;
};
