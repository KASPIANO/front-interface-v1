import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TableHeader = styled('th')({});

export const StyledDataGridContainer = styled(Box)({
    height: '80vh',
    width: '83vw',
    display: 'flex',
    borderRadius: '8px',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(111, 199, 186, 0.3)',
    border: '2px solid  rgba(111, 199, 186, 0.3)',
    margin: 'auto', // Center the grid horizontally
});

export const NoDataContainer = styled(Box)({
    height: '80vh',
    width: '83vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto', // Center the grid horizontally
    marginTop: '2vh', // Add some top margin for better spacing
    backgroundColor: '#1e1e2f', // Match the background color with your theme
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});
