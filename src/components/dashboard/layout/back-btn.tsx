import { Box, IconButton } from '@mui/material';
import { ArrowBendDownLeft } from '@phosphor-icons/react';
import React from 'react';

const BackBtn: React.FC= () => {    

    function handleBack(): void {
        window.history.back();
    }
    
    return (
        <Box mb={2}>
            <IconButton onClick={handleBack}>
                <ArrowBendDownLeft/>
            </IconButton>   
      </Box>
 );
};

export default BackBtn;