import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            Previous
        </Button>
        <Typography variant="body1" sx={{ margin: '0 1rem' }}>
            Page {currentPage} of {totalPages}
        </Typography>
        <Button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            Next
        </Button>
    </Box>
);

export default PaginationControls;
