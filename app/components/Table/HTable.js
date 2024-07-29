import React, { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';

const HTable = ({ data }) => {
  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'Host',
        header: 'Host',
        filterFn: 'startsWith',
        size: 200,
      },
      {
        accessorKey: 'ServerName',
        header: 'Server Name',
        filterFn: 'startsWith',
        size: 150,
      },
      {
        accessorKey: 'ClientName',
        header: 'Client Name',
        filterFn: 'startsWith',
        size: 150,
      },
      
      {
        accessorKey: 'Status',
        header: 'Status',
        filterVariant: 'multi-select',
        filterSelectOptions: ['Active','Failed','Interrupted'],
        size: 150,
        Cell: ({ cell }) => (
          <Box
            component="div"
            sx={(theme) => ({
              borderRadius: '0.5rem',
              width: '6rem',
              height: '2rem',
              padding: '0.5rem',
              display: 'inline-block',
              textAlign: 'center',
              backgroundColor:
                cell.getValue() === 'Active'
                  ? theme.palette.success.main
                  : cell.getValue() === 'Failed'
                  ? theme.palette.error.main
                  : cell.getValue() === 'Interrupted'
                  ? theme.palette.info.main
                  : '#808080', // Default color for unrecognized status
              color: theme.palette.getContrastText(
                cell.getValue() === 'Interrupted'
                  ? theme.palette.info.main
                  : theme.palette[cell.getValue()]?.main || '#808080'
              ),
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'ServerPort',
        header: 'Server Port',
        filterFn: 'startsWith',
        size: 150,
      },
      {
        accessorKey: 'ClientPort',
        header: 'Client Port',
        filterFn: 'startsWith',
        size: 150,
      },
      {
        accessorKey: 'DataRate',
        header: 'Data Rate',
        filterVariant: 'range',
        filterFn: 'between',
        size: 150,
      },
    ],
    [],
  );

  const baseBackgroundColor ='rgba(206,234,255)';


  const table = useMaterialReactTable({
    columns,
    data,
    columnFilterDisplayMode: 'popover',
    globalFilterFn: 'startsWith',
    enableColumnResizing: true,
    layoutMode: 'grid',
    enableColumnResizing: true,
    enablePagination: false,
    enableColumnOrdering: true,

    muiTableBodyCellProps:{
      sx: {
        backgroundColor: baseBackgroundColor
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "rgba(130,202,255)"
      },
    },
    // muiTopToolbarProps:{
    //   sx: {
    //     backgroundColor: "rgba(130,202,255)"
    //   },
    // },
    muiBottomToolbarProps:{
      sx: {
        backgroundColor: "rgba(130,202,255)"
      },
    },
    

  });

  return <MaterialReactTable table={table} />;
};

export default HTable;
