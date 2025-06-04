// Sample data for reports
export const initialReports = [
  {
    id: 1,
    type: 'Temvo-to-Temvo',
    school: 'Accra Academy',
    amount: '20,000',
    dbid: '1718290',
    crid: '187303',
    date: '17/02/2025',
    status: 'Successful'
  },
  {
    id: 2,
    type: 'Temvo-to-Temvo',
    school: 'Accra Academy',
    amount: '20,000',
    dbid: '1718290',
    crid: '187303',
    date: '17/02/2025',
    status: 'Failed'
  }
];

// School options
export const schoolOptions = [
  { value: 'All', label: 'All' },
  { value: 'Accra Academy', label: 'Accra Academy' },
  { value: 'Other School', label: 'Other School' }
];

// Status options
export const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'Successful', label: 'Successful' },
  { value: 'Failed', label: 'Failed' }
];

// Tab labels
export const tabLabels = [
  'All',
  'Temvo-to-Temvo',
  'Momo-to-Temvo',
  'Bank-to-Temvo'
];

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
