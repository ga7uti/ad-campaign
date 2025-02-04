'use client';

import { useAuth } from '@/hooks/use-auth';
import { utils } from '@/lib/common-utils';
import { paths } from '@/paths';
import { Campaign } from '@/types/campaign';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Eye, Pencil, PencilSlash, Upload } from '@phosphor-icons/react';
import { Download } from '@phosphor-icons/react/dist/ssr/Download';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface TableProps<T> {
  count?: number;
  page?: number;
  rows?: T;
  rowsPerPage?: number;
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowClick?: (id: number,operation:string) => void;
}

const tableCellStyles = {
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',   
};

export function CampaignTable({
  count = 0,
  rows = [],
  page = 1,
  rowsPerPage = 10,
  handlePageChange,
  onRowClick,
}: TableProps<Campaign[]>): React.JSX.Element {
  const {auth} = useAuth();
  const router = useRouter()
  
  const handleRowClick = (id: number,operation:string) => {
    if (onRowClick) {
      onRowClick(id,operation);
    }
  };

  const onEditClick =(id:number)=>{
    const selectedCampaign = rows.find((campaign) => campaign.id === id);
    if(selectedCampaign){
      sessionStorage.setItem("campaign",JSON.stringify(utils.transformCampaignToFormData(selectedCampaign)));       
      router.push(paths.dashboard.createCampaign) 
    }
  }
  
  return (
    <Card sx={{ borderRadius: 0 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={tableCellStyles}>Id</TableCell>
              <TableCell sx={tableCellStyles}>Name</TableCell>
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
              <TableCell sx={tableCellStyles}>View</TableCell>
              <TableCell sx={tableCellStyles}>Edit</TableCell>
              {auth?.usertype==='admin'?<TableCell sx={tableCellStyles}>Upload</TableCell>:
                 <TableCell sx={tableCellStyles}>Download</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell sx={tableCellStyles}>{row.id}</TableCell>
                <TableCell sx={tableCellStyles}>{row.name}</TableCell>
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
                <TableCell sx={tableCellStyles}><Eye onClick={() => handleRowClick(row.id,"view")} fontSize="var(--icon-fontSize-md)" /></TableCell>
                {auth?.usertype==='admin'?
                  <>  
                    <TableCell sx={tableCellStyles}><Pencil onClick={() => handleRowClick(row.id,"edit-admin")}fontSize="var(--icon-fontSize-md)" /></TableCell>
                    <TableCell sx={tableCellStyles}><Upload onClick={() => handleRowClick(row.id,"upload")}fontSize="var(--icon-fontSize-md)" /></TableCell>
                  </>
                  :
                  <>
                    {row.status === "Created" && <TableCell sx={tableCellStyles}><Pencil onClick={() => onEditClick(row.id)}fontSize="var(--icon-fontSize-md)" /></TableCell>}
                    {row.status !== "Created" && <TableCell sx={tableCellStyles}><PencilSlash color='#cccccc' fontSize="var(--icon-fontSize-md)" /></TableCell>}
                    <TableCell sx={tableCellStyles}><Download onClick={() => handleRowClick(row.id,"download")}fontSize="var(--icon-fontSize-md)" /></TableCell>
                  </>
                }
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