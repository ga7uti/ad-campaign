'use client';

import { Campaign } from '@/types/campaign';
import { TableProps } from '@/types/form-data';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { minWidth } from '@mui/system';
import dayjs from 'dayjs';
import * as React from 'react';

const tableCellStyles = {
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const fixedTableFirstCellStyle = {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    bgcolor: 'background.paper',
    minWidth: '50px',
    maxWidth: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

const fixedTableSecondCellStyle = {
  position: 'sticky',
  left: "50px",
  zIndex: 2,
  bgcolor: 'background.paper',
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export function CampaignTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 10,
  handlePageChange
}: TableProps<Campaign[]>): React.JSX.Element {
  
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={fixedTableFirstCellStyle}>Id</TableCell>
              <TableCell sx={fixedTableSecondCellStyle}>Name</TableCell>
              <TableCell sx={tableCellStyles}>AgeRange</TableCell>
              <TableCell sx={tableCellStyles}>Device</TableCell>
              <TableCell sx={tableCellStyles}>Location</TableCell>
              <TableCell sx={tableCellStyles}>Exchange</TableCell>
              <TableCell sx={tableCellStyles}>Environment</TableCell>
              <TableCell sx={tableCellStyles}>Language</TableCell>
              <TableCell sx={tableCellStyles}>Carrier</TableCell>
              <TableCell sx={tableCellStyles}>Device Price</TableCell>
              <TableCell sx={tableCellStyles}>Interest</TableCell>
              <TableCell sx={tableCellStyles}>Impression</TableCell>
              <TableCell sx={tableCellStyles}>Click</TableCell>
              <TableCell sx={tableCellStyles}>PayRate</TableCell>
              <TableCell sx={tableCellStyles}>UpdatedAt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell sx={fixedTableFirstCellStyle}>{row.id}</TableCell>
                <TableCell sx={fixedTableSecondCellStyle}>{row.name}</TableCell>
                <TableCell sx={tableCellStyles}>{row.age.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.device.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.location.map((location) => location.city).join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.exchange.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.environment.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.language.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.carrier.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.device_price.join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.target_type.map((data) => data.category).join(',')}</TableCell>
                <TableCell sx={tableCellStyles}>{row.impression}</TableCell>
                <TableCell sx={tableCellStyles}>{row.click}</TableCell>
                <TableCell sx={tableCellStyles}>{row.pay_rate}</TableCell>
                <TableCell sx={tableCellStyles}>{dayjs(row.updated_at).format('MMM D, YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        page={page-1}
        rowsPerPage={rowsPerPage}
      />
    </Card>
  );
}