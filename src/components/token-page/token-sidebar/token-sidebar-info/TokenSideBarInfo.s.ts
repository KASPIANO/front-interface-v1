import { styled, Box, Paper, Button } from '@mui/material';

export const DataRowContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
});

export const DataPaper = styled(Paper)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
}));

export const SentimentsContainerBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1vw',
});

export const SentimentButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

    '&.selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));

export const ImageAndSocialsBarContainer = styled(Box)({
    position: 'relative',
    '& .SocialsBar': {
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
});
