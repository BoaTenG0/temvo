
import { useState, useMemo } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Collapse,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';
import {
  Filter,
  SearchNormal1,
  ArrowDown2,
  ArrowUp2,
  Bank,
  Calendar,
  MoneyRecive,
  MoneySend,
  Wallet3,
  TickCircle,
  Clock,
  CloseCircle,
  DocumentText1,
  Mobile,
  Card as CardIcon
} from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { useGetAllTransactionBySchool } from 'api/requests';
import dayjs from 'dayjs';

function convertDateJS(isoDateString) {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TransactionsSection = ({ schoolId }) => {
  const theme = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const initialStartDate = dayjs().subtract(7, 'days');
  const initialEndDate = dayjs();

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    from: convertDateJS(initialStartDate.toDate()),
    to: convertDateJS(initialEndDate.toDate()),
    amountMin: '',
    amountMax: '',
    provider: '',
    channel: '',
    search: ''
  });

  const {
    data: schoolT,
    isLoading: isLoadingSchoolTrans,
    error: isSchoolTransError
  } = useGetAllTransactionBySchool({ ...filters, page, size }, schoolId);

  const schoolTrans = schoolT?.content;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      from: '',
      to: '',
      amountMin: '',
      amountMax: '',
      provider: '',
      channel: '',
      search: ''
    });
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return <TickCircle size="16" color={theme.palette.success.main} />;
      case 'PENDING':
        return <Clock size="16" color={theme.palette.warning.main} />;
      case 'FAILED':
        return <CloseCircle size="16" color={theme.palette.error.main} />;
      default:
        return <Clock size="16" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'FUND':
        return 'primary';
      case 'TRANSFER':
        return 'secondary';
      case 'WITHDRAW':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'FUND':
        return <MoneyRecive size="16" color={theme.palette.primary.main} />;
      case 'TRANSFER':
        return <MoneySend size="16" color={theme.palette.secondary.main} />;
      case 'WITHDRAW':
        return <Wallet3 size="16" color={theme.palette.error.main} />;
      default:
        return <MoneyRecive size="16" />;
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toUpperCase()) {
      case 'MTN':
      case 'VODAFONE':
      case 'AIRTELTIGO':
        return <Mobile size="16" color={theme.palette.info.main} />;
      default:
        return <CardIcon size="16" color={theme.palette.info.main} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const transactionSummary = useMemo(() => {
    if (!schoolTrans) return { total: 0, successful: 0, pending: 0, failed: 0 };

    return schoolTrans.reduce(
      (acc, trans) => {
        acc.total += trans.amount;
        switch (trans.status?.toUpperCase()) {
          case 'SUCCESS':
            acc.successful++;
            break;
          case 'PENDING':
            acc.pending++;
            break;
          case 'FAILED':
            acc.failed++;
            break;
        }
        return acc;
      },
      { total: 0, successful: 0, pending: 0, failed: 0 }
    );
  }, [schoolTrans]);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <MoneyRecive size="28" color={theme.palette.success.main} />
        <Typography variant="h4" fontWeight="600">
          Transactions
        </Typography>
      </Box>

      {/* Transaction Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight="600">
                    {formatCurrency(transactionSummary.total)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                  <Bank size="24" color={theme.palette.primary.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Successful
                  </Typography>
                  <Typography variant="h5" fontWeight="600" color="success.main">
                    {transactionSummary.successful}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <TickCircle size="24" color={theme.palette.success.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h5" fontWeight="600" color="warning.main">
                    {transactionSummary.pending}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                  <Clock size="24" color={theme.palette.warning.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h5" fontWeight="600" color="error.main">
                    {transactionSummary.failed}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                  <CloseCircle size="24" color={theme.palette.error.main} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <Box p={3} pb={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="600">
              Transaction History
            </Typography>
            <Button
              startIcon={<Filter size="20" />}
              endIcon={showFilters ? <ArrowUp2 size="16" /> : <ArrowDown2 size="16" />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
            >
              Filters
            </Button>
          </Box>

          {/* Filters Section */}
          <Collapse in={showFilters}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search"
                    placeholder="Reference, narration, or description"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchNormal1 size="20" color={theme.palette.action.active} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      input={<OutlinedInput label="Transaction Type" />}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="FUND">
                        <Box display="flex" alignItems="center" gap={1}>
                          <MoneyRecive size="16" />
                          Fund
                        </Box>
                      </MenuItem>
                      <MenuItem value="TRANSFER">
                        <Box display="flex" alignItems="center" gap={1}>
                          <MoneySend size="16" />
                          Transfer
                        </Box>
                      </MenuItem>
                      <MenuItem value="WITHDRAW">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Wallet3 size="16" />
                          Withdraw
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      input={<OutlinedInput label="Status" />}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="SUCCESS">
                        <Box display="flex" alignItems="center" gap={1}>
                          <TickCircle size="16" color={theme.palette.success.main} />
                          Success
                        </Box>
                      </MenuItem>
                      <MenuItem value="PENDING">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Clock size="16" color={theme.palette.warning.main} />
                          Pending
                        </Box>
                      </MenuItem>
                      <MenuItem value="FAILED">
                        <Box display="flex" alignItems="center" gap={1}>
                          <CloseCircle size="16" color={theme.palette.error.main} />
                          Failed
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    value={filters.from}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size="18" color={theme.palette.action.active} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    value={filters.to}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size="18" color={theme.palette.action.active} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Min Amount"
                    type="number"
                    value={filters.amountMin}
                    onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyRecive size="18" color={theme.palette.action.active} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Max Amount"
                    type="number"
                    value={filters.amountMax}
                    onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyRecive size="18" color={theme.palette.action.active} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Provider</InputLabel>
                    <Select
                      value={filters.provider}
                      onChange={(e) => handleFilterChange('provider', e.target.value)}
                      input={<OutlinedInput label="Provider" />}
                    >
                      <MenuItem value="">All Providers</MenuItem>
                      <MenuItem value="MTN">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Mobile size="16" />
                          MTN
                        </Box>
                      </MenuItem>
                      <MenuItem value="VODAFONE">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Mobile size="16" />
                          Vodafone
                        </Box>
                      </MenuItem>
                      <MenuItem value="AIRTELTIGO">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Mobile size="16" />
                          AirtelTigo
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Channel</InputLabel>
                    <Select
                      value={filters.channel}
                      onChange={(e) => handleFilterChange('channel', e.target.value)}
                      input={<OutlinedInput label="Channel" />}
                    >
                      <MenuItem value="">All Channels</MenuItem>
                      <MenuItem value="MOBILE_MONEY">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Mobile size="16" />
                          Mobile Money
                        </Box>
                      </MenuItem>
                      <MenuItem value="REDDE">
                        <Box display="flex" alignItems="center" gap={1}>
                          <CardIcon size="16" />
                          Redde
                        </Box>
                      </MenuItem>
                      <MenuItem value="BANK">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Bank size="16" />
                          Bank
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button variant="outlined" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </Box>

        {/* Transactions Table */}
        {isLoadingSchoolTrans ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : isSchoolTransError ? (
          <Box p={3}>
            <Alert severity="error">Failed to load transactions: {isSchoolTransError.message}</Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schoolTrans?.map((transaction, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DocumentText1 size="16" color={theme.palette.primary.main} />
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {transaction.transactionReference}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.externalReference}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getTypeIcon(transaction.type)}
                          <Chip label={transaction.type} color={getTypeColor(transaction.type)} size="small" variant="outlined" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(transaction.status)}
                          <Chip label={transaction.status} color={getStatusColor(transaction.status)} size="small" />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getProviderIcon(transaction.provider)}
                          <Typography variant="body2">{transaction.provider}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{transaction.channel}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{transaction.transDescription}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.narration}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Calendar size="16" color={theme.palette.action.active} />
                          <Typography variant="body2">{formatDate(transaction.createdAt)}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={schoolT?.totalElements || 0}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={size}
              onRowsPerPageChange={(event) => {
                setSize(Number.parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionsSection;
