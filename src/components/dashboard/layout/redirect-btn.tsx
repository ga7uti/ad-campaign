import { Button } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import RouterLink from 'next/link';
import React from 'react';

interface AddCampaignProps {
    url: string;  
}

const RedirectBtn: React.FC<AddCampaignProps> = ({ url }) => {    

    return (
        <Button component={RouterLink} href={url} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">Add</Button>
    );
};

export default RedirectBtn;