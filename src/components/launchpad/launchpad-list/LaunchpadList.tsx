import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { useGetLaunchpads } from '../../../DAL/LaunchPadQueries';
import { useNavigate } from 'react-router-dom';

// Define the ProgressBar as a separate component for better clarity
const ProgressBar = ({ value, total }: { value: number; total: number }) => {
    const left = total - value;
    const progress = total > 0 ? (left / total) * 100 : 0; // Avoid division by zero
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100%', mr: 1, mt: '1rem' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ minWidth: 35, mt: '1rem' }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
            </Box>
        </Box>
    );
};

const columns: GridColDef[] = [
    { field: 'ticker', headerName: 'Ticker', filterable: false, width: 100 },
    {
        field: 'progress',
        headerName: 'Progress',
        filterable: false,
        width: 200,

        renderCell: (params) => (
            <ProgressBar value={params.row.availabeUnits || 0} total={params.row.totalUnits || 1} />
        ),
    },
    { field: 'kasPerUnit', headerName: 'Kas per Unit', filterable: false, width: 120 },
    { field: 'tokenPerUnit', headerName: 'Tokens per Unit', filterable: false, width: 120 },
    { field: 'roundNumber', headerName: 'Round', filterable: false, width: 100 },
    {
        field: 'maxUnitsPerWallet',
        headerName: 'Limit per wallet',
        filterable: false,
        width: 150,
        valueGetter: (params: any) => params ?? 'No limit',
    },
    {
        field: 'useWhitelist',
        headerName: 'Whitelist',
        filterable: false,
        width: 100,

        valueGetter: (params: any) => (params ? 'Yes' : 'No'),
    },
];

const LaunchpadList: React.FC = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetLaunchpads();
    const handleRowClick = (ticker: string) => {
        navigate(`/launchpad/${ticker}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Connect Wallet</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '25rem', width: '100%' }}>
            <DataGrid
                sx={{
                    border: '2.5px solid rgba(111, 199, 186, 0.25)',
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer', // Make the cursor a pointer on hover
                    },
                }}
                rows={data?.lunchpads || []} // Ensure rows fallback to an empty array
                columns={columns}
                pagination
                pageSizeOptions={[5, 10, 20]} // Provide multiple page size options
                disableRowSelectionOnClick
                getRowId={(row) => row.id} // Ensure unique identifiers for rows
                onRowClick={(row) => handleRowClick(row.row.ticker)} // Log the row ID on click
            />
        </Box>
    );
};

export default LaunchpadList;
