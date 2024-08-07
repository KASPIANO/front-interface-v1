import { FC, useEffect, useState } from 'react';
import { Token, TokenHolder } from '../../../types/Types';
import {
    Box,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

interface TokenHoldersProps {
    tokenInfo: Token;
}

const TokenHolders: FC<TokenHoldersProps> = (props) => {
    const [limit, setLimit] = useState(10);
    const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);

    useEffect(() => {
        setTokenHolders(props.tokenInfo?.holder || []);

        // const tokenHoldersDuplicated = [...props.tokenInfo?.holder || []].flatMap((holder) =>
        //     Array(20).fill(holder)
        // );
        // setTokenHolders(tokenHoldersDuplicated);
    }, [props.tokenInfo?.holder]);

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(event.target.value));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    Token Top Holders
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                        Show
                    </Typography>
                    <TextField select size="small" value={limit} onChange={handleLimitChange} sx={{ width: 100 }}>
                        {[10, 20, 30, 40, 50].map((option) => (
                            <MenuItem key={option} value={option} disabled={tokenHolders.length + 9 < option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        holders
                    </Typography>
                </Box>
            </Box>
            {tokenHolders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        maxWidth: 350,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    Address
                                </TableCell>
                                <TableCell>Holding %</TableCell>
                                <TableCell>Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tokenHolders.slice(0, limit).map((holder: TokenHolder) => (
                                <TableRow key={holder.address}>
                                    <TableCell>
                                        <Tooltip title={holder.address}>
                                            <Typography
                                                sx={{
                                                    maxWidth: 350,
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {holder.address}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            (parseFloat(holder.amount) /
                                                parseFloat(props.tokenInfo?.minted || '0')) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </TableCell>
                                    <TableCell>{holder.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ color: '#6a7179' }}>
                    No token holders found
                </Typography>
            )}
        </Box>
    );
};

export default TokenHolders;
