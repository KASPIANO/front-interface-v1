import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SearchContainer = styled(TextField)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper, // Uses theme background color
    borderRadius: '6px',
    '& .MuiInputBase-root': {
        color: theme.palette.primary, // Text color from theme
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main, // Border color from theme
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.dark, // Darker primary color on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.secondary.main, // Secondary color when focused
    },
}));
