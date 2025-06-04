// Sample data for schools
export const initialSchools = [
  {
    id: 1,
    schoolName: 'Accra Academy',
    schoolNumber: '879809-0109',
    schoolRegion: 'Greater Accra',
    students: '3000',
    pos: '25',
    wristbands: '2500',
    status: 'Assigned'
  },
  {
    id: 2,
    schoolName: 'VVU JHS',
    schoolNumber: '87980-3494',
    schoolRegion: 'Greater Accra',
    students: '3000',
    pos: '25',
    wristbands: '2500',
    status: 'Unassigned'
  }
];

// School options
export const schoolOptions = [
  { value: 'All', label: 'All' },
  { value: 'Accra Academy', label: 'Accra Academy' },
  { value: 'VVU JHS', label: 'VVU JHS' },
  { value: 'Other School', label: 'Other School' }
];

// Region options
export const regionOptions = [
  { value: 'All', label: 'All' },
  { value: 'Greater Accra', label: 'Greater Accra' },
  { value: 'Central Region', label: 'Central Region' },
  { value: 'Volta Region', label: 'Volta Region' },
  { value: 'Ashanti Region', label: 'Ashanti Region' },
  { value: 'Northern Region', label: 'Northern Region' }
];

// Status options
export const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Assigned', label: 'Active' },
  { value: 'Unassigned', label: 'Inactive' }
];

// Rows per page options
export const rowsPerPageOptions = [5, 10, 25, 50];

// Modal style
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

// Initial form states
export const initialNewSchool = {
  schoolName: '',
  schoolNumber: '',
  schoolRegion: '',
  adminName: '',
  adminNumber: '',
  adminEmail: ''
};

export const initialAssignData = {
  school: 'Accra Academy',
  count: ''
};

// Tab labels
export const tabLabels = [
  'All Schools',
  'Active',
  'Inactive'
];
