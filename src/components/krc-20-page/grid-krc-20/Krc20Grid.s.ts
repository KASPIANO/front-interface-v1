import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

// export const StyledDataGridContainer = styled(Box)({
//     height: '80vh',
//     width: '95vw',
//     display: 'flex',
//     margin: 'auto', // Center the grid horizontally
//     marginTop: '2vh', // Add some top margin for better spacing
//     backgroundColor: '#1e1e2f', // Match the background color with your theme
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
// });

export const StyledDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-root': {
        border: 'none',
    },
    '& .MuiDataGrid-columnHeaders': {
        fontWeight: 'bold',
        fontSize: '1.1vw',
    },
    '& .MuiDataGrid-cell': {
        color: '#fff',
    },
    '& .MuiDataGrid-row': {
        backgroundColor: '#1e1e2f',
        '&:nth-of-type(even)': {
            backgroundColor: '#2b2b3b',
        },
    },
    '& .MuiDataGrid-footerContainer': {
        backgroundColor: '#2b2b3b',
    },
});

export const TableHeader = styled('th')({
    fontSize: '1vw',
    color: '#fff',
    fontWeight: 'bold',
});

export const StyledDataGridContainer = styled(Box)({
    height: '80vh',
    width: '95vw',
    display: 'flex',
    margin: 'auto', // Center the grid horizontally
    marginTop: '2vh', // Add some top margin for better spacing
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    flexDirection: 'column',
});

export const NoDataContainer = styled(Box)({
    height: '80vh',
    width: '95vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto', // Center the grid horizontally
    marginTop: '2vh', // Add some top margin for better spacing
    backgroundColor: '#1e1e2f', // Match the background color with your theme
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});
