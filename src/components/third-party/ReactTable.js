import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// third-party
import { CSVLink } from 'react-csv';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrop, useDrag, useDragLayer } from 'react-dnd';

// assets
import { ArrowDown2, ArrowUp2, DocumentDownload, HambergerMenu, Maximize1 } from 'iconsax-react';

// project import
import { ThemeMode } from 'config';

// ==============================|| SORT HEADER ||============================== //

export const HeaderSort = ({ column, sort }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 'max-content' }}>{column.render('Header')}</Box>
      {!column.disableSortBy && (
        <Stack sx={{ color: 'secondary.light' }} {...(sort && { ...column.getHeaderProps(column.getSortByToggleProps()) })}>
          <ArrowUp2
            size={16}
            variant="Bold"
            style={{
              color: column.isSorted && !column.isSortedDesc ? theme.palette.secondary.main : 'inherit'
            }}
          />
          <ArrowDown2
            size={16}
            variant="Bold"
            style={{
              marginTop: -8,
              color: column.isSortedDesc ? theme.palette.secondary.main : 'inherit'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

HeaderSort.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool
};
// ==============================|| TABLE PAGINATION ||============================== //

export const TablePagination = ({ gotoPage, rows, setPageSize, pageSize, pageIndex, initialPageSize }) => {
  const [open, setOpen] = useState(false);
  let options = [5, 10, 25, 50, 100];

  if (initialPageSize) {
    options = [...options, initialPageSize]
      .filter((item, index) => [...options, initialPageSize].indexOf(item) === index)
      .sort(function (a, b) {
        return a - b;
      });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = (event, value) => {
    gotoPage(value - 1);
  };

  const handleChange = (event) => {
    setPageSize(+event.target.value);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="secondary">
              Row per page
            </Typography>
            <FormControl sx={{ m: 1 }}>
              <Select
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={pageSize}
                onChange={handleChange}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="caption" color="secondary">
            Go to
          </Typography>
          <TextField
            size="small"
            type="number"
            value={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              gotoPage(page - 1);
            }}
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
          />
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          count={Math.ceil(rows.length / pageSize)}
          page={pageIndex + 1}
          onChange={handleChangePagination}
          color="primary"
          variant="combined"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

TablePagination.propTypes = {
  gotoPage: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  initialPageSize: PropTypes.number,
  rows: PropTypes.array
};

// ==============================|| SELECTION - PREVIEW ||============================== //

export const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  return <Checkbox indeterminate={indeterminate} ref={resolvedRef} {...rest} />;
});

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool
};

export const TableRowSelection = ({ selected }) => (
  <>
    {selected > 0 && (
      <Chip
        size="small"
        label={`${selected} row(s) selected`}
        color="secondary"
        variant="light"
        sx={{
          position: 'absolute',
          right: -1,
          top: -1,
          borderRadius: '0 4px 0 4px'
        }}
      />
    )}
  </>
);

TableRowSelection.propTypes = {
  selected: PropTypes.number
};

// ==============================|| DRAG & DROP - DRAGGABLE HEADR ||============================== //

export const DraggableHeader = ({ children, column, index, reorder }) => {
  const theme = useTheme();
  const ref = useRef();
  const { id, Header } = column;

  const DND_ITEM_TYPE = 'column';

  const [{ isOverCurrent }, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item) => {
      reorder(item, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => ({
      id,
      index,
      header: Header
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(drop(ref));

  let borderColor = theme.palette.text.primary;
  if (isOverCurrent) {
    borderColor = theme.palette.primary.main;
  }

  return (
    <Box sx={{ cursor: 'move', opacity: isDragging ? 0.5 : 1, color: borderColor }} ref={ref}>
      {children}
    </Box>
  );
};

DraggableHeader.propTypes = {
  column: PropTypes.any,
  sort: PropTypes.bool,
  reorder: PropTypes.func,
  index: PropTypes.number,
  children: PropTypes.node
};

// ==============================|| DRAG & DROP - DRAG PREVIEW ||============================== //

const DragHeader = styled('div')(({ theme, x, y }) => ({
  color: theme.palette.text.secondary,
  position: 'fixed',
  pointerEvents: 'none',
  left: 12,
  top: 24,
  transform: `translate(${x}px, ${y}px)`,
  opacity: 0.6
}));

export const DragPreview = () => {
  const theme = useTheme();

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const { x, y } = currentOffset || {};

  return isDragging ? (
    <DragHeader theme={theme} x={x} y={y}>
      {item.header && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Maximize1 style={{ fontSize: '1rem' }} />
          <Typography>{item.header}</Typography>
        </Stack>
      )}
    </DragHeader>
  ) : null;
};

// ==============================|| DRAG & DROP - DRAGGABLE ROW ||============================== //

export const DraggableRow = ({ index, moveRow, children }) => {
  const DND_ITEM_TYPE = 'row';

  const dropRef = useRef(null);
  const dragRef = useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <TableRow ref={dropRef} style={{ opacity, backgroundColor: isDragging ? 'red' : 'inherit' }}>
      <TableCell ref={dragRef} sx={{ cursor: 'move', textAlign: 'center' }}>
        <HambergerMenu size={16} />
      </TableCell>
      {children}
    </TableRow>
  );
};

DraggableRow.propTypes = {
  moveRow: PropTypes.func,
  index: PropTypes.number,
  children: PropTypes.node
};

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200
    }
  }
};

export const HidingSelect = ({ hiddenColumns, setHiddenColumns, allColumns }) => {
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    setHiddenColumns(typeof value === 'string' ? value.split(',') : value);
  };

  let visible = allColumns.filter((c) => !hiddenColumns.includes(c.id)).length;

  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        id="column-hiding"
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={<OutlinedInput id="select-column-hiding" placeholder="select column" />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography variant="subtitle1">All columns visible</Typography>;
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return <Typography variant="subtitle1">All columns visible</Typography>;
          }

          return <Typography variant="subtitle1">{visible} column(s) visible</Typography>;
        }}
        MenuProps={MenuProps}
        size="small"
      >
        {allColumns.map((column) => {
          let ToggleChecked = column.id === '#' ? true : hiddenColumns.indexOf(column.id) > -1 ? false : true;
          return (
            <MenuItem key={column.id} value={column.id} sx={{ '&.Mui-selected': { bgcolor: 'background.paper' } }}>
              <Checkbox checked={ToggleChecked} color="success" />
              <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setHiddenColumns: PropTypes.func,
  hiddenColumns: PropTypes.array,
  allColumns: PropTypes.array
};

// ==============================|| COLUMN SORTING - SELECT ||============================== //

export const SortingSelect = ({ sortBy, setSortBy, allColumns }) => {
  const [sort, setSort] = useState(sortBy);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setSort(value);
    setSortBy([{ id: value, desc: false }]);
  };

  return (
    <FormControl sx={{ width: 200 }}>
      <Select
        id="column-hiding"
        displayEmpty
        value={sort}
        onChange={handleChange}
        input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
        renderValue={(selected) => {
          const selectedColumn = allColumns.filter((column) => column.id === selected)[0];
          if (!selected) {
            return <Typography variant="subtitle1">Sort By</Typography>;
          }

          return (
            <Typography variant="subtitle2">
              Sort by ({typeof selectedColumn.Header === 'string' ? selectedColumn.Header : selectedColumn?.title})
            </Typography>
          );
        }}
      >
        {allColumns
          .filter((column) => column.canSort)
          .map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <ListItemText primary={typeof column.Header === 'string' ? column.Header : column?.title} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

SortingSelect.propTypes = {
  setSortBy: PropTypes.func,
  sortBy: PropTypes.string,
  allColumns: PropTypes.array
};

// ==============================|| CSV EXPORT ||============================== //

export const CSVExport = ({ data, filename, headers }) => {
  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Tooltip title="CSV Export">
        <DocumentDownload size={28} style={{ color: 'gray', marginTop: 4 }} />
      </Tooltip>
    </CSVLink>
  );
};

CSVExport.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.any,
  filename: PropTypes.string
};

// ==============================|| EMPTY TABLE - NO DATA  ||============================== //

const StyledGridOverlay = styled(Stack)(({ theme }) => ({
  height: '400px',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary[400]
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.secondary.light
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[400] : theme.palette.secondary[200]
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.dark : theme.palette.common.white
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === ThemeMode.DARK ? '0.09' : '0.95',
    fill: theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary.darker : theme.palette.secondary.light
  }
}));

export const EmptyTable = ({ msg, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <StyledGridOverlay alignItems="center" justifyContent="center" spacing={1}>
          <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
            <g fill="none" fillRule="evenodd">
              <g transform="translate(24 31.67)">
                <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                <path
                  className="ant-empty-img-1"
                  d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                />
                <path
                  className="ant-empty-img-2"
                  d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                />
                <path
                  className="ant-empty-img-3"
                  d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                />
              </g>
              <path
                className="ant-empty-img-3"
                d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
              />
              <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
              </g>
            </g>
          </svg>
          <Typography align="center" color="secondary">
            {msg}
          </Typography>
        </StyledGridOverlay>
      </TableCell>
    </TableRow>
  );
};

EmptyTable.propTypes = {
  msg: PropTypes.string,
  colSpan: PropTypes.number
};

export const TableLoading = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <StyledGridOverlay alignItems="center" justifyContent="center" spacing={1}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <CircularProgress color="primary" />
            <Typography variant="subtitle1">Loading...</Typography>
          </Stack>
        </StyledGridOverlay>
      </TableCell>
    </TableRow>
  );
};

TableLoading.propTypes = {
  colSpan: PropTypes.number
}; 