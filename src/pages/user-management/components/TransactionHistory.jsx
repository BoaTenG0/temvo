import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  TablePagination,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Skeleton,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { ArrowDown, ArrowUp, More, TrendDown, TrendUp, SearchNormal1, DocumentDownload, Refresh } from 'iconsax-react';
import { TransactionFilters } from './TransactionFilters';

export function TransactionHistory({
  transactions,
  isLoading,
  filters,
  search,
  page,
  rowsPerPage,
  onFiltersChange,
  onClearFilters,
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onRefresh
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? (
      <TrendUp size={20} color={theme.palette.success.main} />
    ) : (
      <TrendDown size={20} color={theme.palette.error.main} />
    );
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'fund':
        return <ArrowDown size={16} />;
      case 'withdraw':
        return <ArrowUp size={16} />;
      default:
        return <ArrowDown size={16} />;
    }
  };

  const TransactionMobileView = () => (
    <List sx={{ p: 0 }}>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <ListItem key={index} sx={{ px: 0, py: 2 }}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width="60%" />}
              secondary={
                <Box>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              }
            />
          </ListItem>
        ))
      ) : transactions?.content?.length > 0 ? (
        transactions.content.map((transaction, index) => (
          <React.Fragment key={transaction.transactionReference}>
            <ListItem
              sx={{
                px: 0,
                py: 2,
                alignItems: 'flex-start'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: transaction.type === 'credit' ? 'success.50' : 'error.50',
                    color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                  }}
                >
                  {getTransactionIcon(transaction.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {transaction.transDescription}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {transaction.narration}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.createdAt)} • {transaction.provider}
                      </Typography>
                      <Chip label={transaction.status} size="small" color={getStatusColor(transaction.status)} variant="outlined" />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < transactions.content.length - 1 && <Divider />}
          </React.Fragment>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No transactions found
          </Typography>
        </Box>
      )}
    </List>
  );

  const TransactionTableView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Transaction</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="text" width={80} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={60} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
              </TableRow>
            ))
          ) : transactions?.content?.length > 0 ? (
            transactions.content.map((transaction) => (
              <TableRow key={transaction.transactionReference} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: transaction.type === 'credit' ? 'success.50' : 'error.50',
                        color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.type === 'credit' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {transaction.transDescription}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.narration}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={transaction.type} size="small" variant="outlined" icon={getTypeIcon(transaction.type)} />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                    }}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={transaction.status} size="small" color={getStatusColor(transaction.status)} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(transaction.createdAt)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.provider}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <More size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No transactions found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Filters */}
      <TransactionFilters filters={filters} onFiltersChange={onFiltersChange} onClearFilters={onClearFilters} />

      {/* Main Transaction Card */}
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header with Search and Actions */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Transaction History
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Refresh size={16} />} variant="outlined" onClick={onRefresh} disabled={isLoading}>
                  Refresh
                </Button>
                <Button size="small" startIcon={<DocumentDownload size={16} />} variant="outlined">
                  Export
                </Button>
              </Box>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={20} />
                  </InputAdornment>
                )
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>

          {/* Transaction Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {transactions?.totalElements || 0} total transactions
            </Typography>
          </Box>

          {/* Transaction List/Table */}
          {isMobile ? <TransactionMobileView /> : <TransactionTableView />}

          {/* Pagination */}
          {transactions?.content?.length > 0 && (
            <TablePagination
              component="div"
              count={transactions?.totalElements || 0}
              page={page}
              onPageChange={onPageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ mt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
