import dayjs from 'dayjs';

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
