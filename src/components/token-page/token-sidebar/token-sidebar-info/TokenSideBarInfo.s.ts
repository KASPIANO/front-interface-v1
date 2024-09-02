import { Stack } from '@chakra-ui/react';
import { styled, Box, Button, Card, CircularProgress } from '@mui/material';

const SENTIMENT_BUTTONS_HEIGHT = '7.5vh';
const SENTIMENT_BUTTONS_PADDING = '10px';

export const DataRow = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const SentimentsContainerBox = styled(Stack)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '20px',
    paddingTop: '0',
    justifyContent: 'center',
    height: `calc(${SENTIMENT_BUTTONS_HEIGHT} + 20px)`,
});

export const SentimentButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: SENTIMENT_BUTTONS_HEIGHT,

    '&.MuiButton-root': {
        padding: SENTIMENT_BUTTONS_PADDING,
        minWidth: '2vw',
        border: 'transparent',
    },

    '&.selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));

export const SentimentLoader = styled(CircularProgress)({
    height: SENTIMENT_BUTTONS_HEIGHT,
    padding: SENTIMENT_BUTTONS_PADDING,
    width: '100%',
});

export const TokenProfileContainer = styled(Box)({
    width: '100%',
    position: 'relative',
});

export const StatCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1vh',
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    border: `0.5px solid ${theme.palette.primary.main}`,
}));
