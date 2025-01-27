'use client';

import { useAuth } from '@/hooks/use-auth';
import { Campaign } from '@/types/campaign';
import { TableProps } from '@/types/form-data';
import { Button } from '@mui/material';
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
import { Download } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload } from '@phosphor-icons/react';

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
  const {auth} = useAuth();

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={fixedTableFirstCellStyle}>Id</TableCell>
              <TableCell sx={fixedTableSecondCellStyle}>Name</TableCell>
              <TableCell sx={tableCellStyles}>Objective</TableCell>
              <TableCell sx={tableCellStyles}>Buy Type</TableCell>
              <TableCell sx={tableCellStyles}>Unit Rate</TableCell>
              <TableCell sx={tableCellStyles}>Budget</TableCell>
              <TableCell sx={tableCellStyles}>Impression</TableCell>
              <TableCell sx={tableCellStyles}>Click</TableCell>
              <TableCell sx={tableCellStyles}>PayRate</TableCell>
              <TableCell sx={tableCellStyles}>CTR</TableCell>
              <TableCell sx={tableCellStyles}>Views</TableCell>
              <TableCell sx={tableCellStyles}>VTR</TableCell>
              <TableCell sx={tableCellStyles}>Status</TableCell>
              {auth?.usertype==='admin'?<TableCell sx={tableCellStyles}>Upload</TableCell>:
                 <TableCell sx={tableCellStyles}>Download</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell sx={fixedTableFirstCellStyle}>{row.id}</TableCell>
                <TableCell sx={fixedTableSecondCellStyle}>{row.name}</TableCell>
                <TableCell sx={tableCellStyles}>{row.objective}</TableCell>
                <TableCell sx={tableCellStyles}>{row.buy_type}</TableCell>
                <TableCell sx={tableCellStyles}>{row.unit_rate}</TableCell>
                <TableCell sx={tableCellStyles}>{row.total_budget}</TableCell>
                <TableCell sx={tableCellStyles}>{row.impression}</TableCell>
                <TableCell sx={tableCellStyles}>{row.click}</TableCell>
                <TableCell sx={tableCellStyles}>{row.pay_rate}</TableCell>
                <TableCell sx={tableCellStyles}>{row.ctr}</TableCell>
                <TableCell sx={tableCellStyles}>{row.views}</TableCell>
                <TableCell sx={tableCellStyles}>{row.vtr}</TableCell>
                <TableCell sx={tableCellStyles}>{row.status}</TableCell>
                {auth?.usertype==='admin'?
                  <TableCell sx={tableCellStyles}><Upload fontSize="var(--icon-fontSize-md)" /></TableCell>:
                  <TableCell sx={tableCellStyles}><Download fontSize="var(--icon-fontSize-md)" /></TableCell>}
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