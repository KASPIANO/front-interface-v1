import { Divider, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TokenRowActivityItem } from '../../../types/Types';
import { capitalizeFirstLetter, formatNumberWithCommas } from '../../../utils/Utils';

interface TokenRowActivityProps {
    token: TokenRowActivityItem;
    walletConnected: boolean;
    kasPrice: number;
    walletBalance: number;
}

const TokenRowActivity: FC<TokenRowActivityProps> = (props) => {
    const { token } = props;
    const id = uuidv4();

    return (
        <div key={token.ticker + id}>
            <ListItem disablePadding sx={{ height: '12vh', marginLeft: '1.4vw' }}>
                <ListItemText
                    sx={{
                        width: '10vw',
                    }}
                    primary={
                        <Tooltip title={token.ticker}>
                            <Typography variant="body1" sx={{ fontSize: '0.75rem' }}>
                                {capitalizeFirstLetter(token.ticker)}
                            </Typography>
                        </Tooltip>
                    }
                />

                <ListItemText
                    sx={{ width: '10vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'start',
                            }}
                        >
                            {formatNumberWithCommas(parseInt(token.amount).toFixed(2))}
                        </Typography>
                    }
                />
                <ListItemText
                    sx={{ width: '10vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'start',
                            }}
                        >
                            {token.type}
                        </Typography>
                    }
                />
                <ListItemText
                    sx={{ width: '32vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'start',
                            }}
                        >
                            {token.time}
                        </Typography>
                    }
                />
            </ListItem>
            <Divider />
        </div>
    );
};

export default TokenRowActivity;
