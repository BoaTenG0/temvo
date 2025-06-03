import dayjs from 'dayjs';
import { createTheme } from '@mui/material/styles';


export const predefinedRanges = [
  {
    label: 'Today',
    value: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'Yesterday',
    value: [dayjs().subtract(1, 'day').startOf('day').toDate(), dayjs().subtract(1, 'day').endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'This week',
    value: [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()],
    placement: 'left'
  },
  {
    label: 'Last 7 days',
    value: [dayjs().subtract(7, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'Last 30 days',
    value: [dayjs().subtract(30, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'Last 60 days',
    value: [dayjs().subtract(60, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'Last 90 days',
    value: [dayjs().subtract(60, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()],
    placement: 'left'
  },
  {
    label: 'This month',
    value: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
    placement: 'left'
  },
  {
    label: 'Last month',
    value: [dayjs().subtract(1, 'month').startOf('month').toDate(), dayjs().subtract(1, 'month').endOf('month').toDate()],
    placement: 'left'
  }
];


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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f7fa'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6
        }
      }
    }
  }
});
