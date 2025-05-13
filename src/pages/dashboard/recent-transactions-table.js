import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TableLoading,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

// import { Add } from 'iconsax-react';
import {
  //   Button,
  //   Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  //   Typography,
  useMediaQuery
} from '@mui/material';

import { Fragment, useEffect, useMemo } from 'react';
import { GlobalFilter, renderFilterTypes } from 'utils/react-table';
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import PropTypes from 'prop-types';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';

function ReactTable({ columns, data, renderRowSubComponent, isLoading }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'school', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['id', 'avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['id', 'age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['id', 'avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={2}>
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            {/* <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="large">
              Add Branch
            </Button> */}
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : data}
              filename={'banking-assetClass-list.csv'}
            />
          </Stack>
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-assetClass': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {isLoading ? (
              <TableLoading colSpan={headerGroups[0].headers.length} />
            ) : (
              <>
                {page.map((row, i) => {
                  prepareRow(row);
                  const rowProps = row.getRowProps();

                  return (
                    <Fragment key={i}>
                      <TableRow
                        {...row.getRowProps()}
                        onClick={() => {
                          row.toggleRowSelected();
                        }}
                        sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                            {cell.render('Cell')}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                    </Fragment>
                  );
                })}
              </>
            )}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

const RecentTransactions = () => {
  const theme = useTheme();
  //   const { user } = useAuth();
  const mode = theme.palette.mode;
  const loading = false;
  const columns = useMemo(
    () => [
      {
        Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />,
        accessor: 'selection',
        Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center'
      },
      {
        Header: 'Type',
        accessor: 'type'
      },
      {
        Header: 'School',
        accessor: 'school'
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => <span>{parseFloat(value).toFixed(2)}</span>
      },
      {
        Header: 'Debited Device ID',
        accessor: 'debit_id'
      },
      {
        Header: 'Credited Device ID',
        accessor: 'credit_id'
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: ({ value }) => {
          const date = new Date(value);
          return <span>{date.toLocaleString()}</span>;
        }
      }
    ],
    [theme, mode]
  );

  const data = useMemo(
    () => [
      {
        id: 1,
        type: 'Student Purchase',
        school: 'Accra Academy',
        amount: 7.0,
        debit_id: 'stu-acc7-6820',
        credit_id: 'pos-aca179000',
        time: '2025-05-13T10:25:00Z'
      },
      {
        id: 2,
        type: 'Student Withdrawal',
        school: 'Accra Academy',
        amount: 10.8,
        debit_id: 'stu-acc7-6820',
        credit_id: 'pos-aca179000',
        time: '2025-05-13T10:30:00Z'
      },
      {
        id: 3,
        type: 'Student Withdrawal',
        school: 'Accra Academy',
        amount: 10.8,
        debit_id: 'stu-acc7-6820',
        credit_id: 'pos-aca179000',
        time: '2025-05-13T10:32:00Z'
      }
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={data || []} isLoading={loading} />
      </ScrollX>
    </MainCard>
  );
};
export default RecentTransactions;
