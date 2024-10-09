import React from 'react';
import { Box } from '@mui/material';
import { NextPageButton, PrevPageButton } from '../../../../../krc-20-page/grid-title-sort/GridTitle.s';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = (props) => {
    const { handlePrevPage, handleNextPage, totalPages, currentPage } = props;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw' }}>
            <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
            </PrevPageButton>
            <NextPageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </NextPageButton>
        </Box>
    );
};

export default PaginationControls;
