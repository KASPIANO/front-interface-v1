import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { mintKRC20Token, transferKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { TokenRowPortfolioItem, TransferObj } from '../../../types/Types';
import { capitalizeFirstLetter } from '../../../utils/Utils';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

interface TokenRowPortfolioProps {
    token: TokenRowPortfolioItem;
    walletConnected: boolean;
    kasPrice: number;
    walletBalance: number;
    handleChange: () => void;
}

const TokenRowPortfolio: FC<TokenRowPortfolioProps> = (props) => {
    const { token, walletConnected, walletBalance, handleChange, kasPrice } = props;
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [destAddress, setDestAddress] = useState('');
    const [currentTicker, setCurrentTicker] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [walletConfirmation, setWalletConfirmation] = useState(false);

    const navigate = useNavigate();

    const validatePositiveNumber = (value) => {
        // This regex allows positive numbers, including decimals, but not zero
        const regex = /^(?!0+\.?0*$)(\d+\.?\d*|\.\d+)$/;
        return regex.test(value);
    };
    const handleTransferDialogClose = () => {
        setOpenTransferDialog(false);
        setDestAddress('');
        setAmount('');
        setError('');
    };

    const handleTransferClick = (event, ticker: string) => {
        event.stopPropagation();
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to transfer a token',
                severity: 'error',
            });
            return;
        }
        setCurrentTicker(ticker);
        setOpenTransferDialog(true);
    };

    const handleTransfer = async () => {
        if (destAddress === '') {
            showGlobalSnackbar({
                message: 'Please enter destination address',
                severity: 'error',
            });
            return;
        }

        const inscribeJsonString: TransferObj = {
            p: 'KRC-20',
            op: 'transfer',
            tick: currentTicker,
            amt: (parseInt(amount) * 100000000).toString(),
            to: destAddress,
        };
        const jsonStringified = JSON.stringify(inscribeJsonString);

        try {
            setWalletConfirmation(true);
            const result = await transferKRC20Token(jsonStringified);
            setWalletConfirmation(false);
            if (result) {
                const { commitId, revealId } = JSON.parse(result);

                showGlobalSnackbar({
                    message: 'Token transferred successfully',
                    severity: 'success',
                    commitId,
                    revealId,
                });
                handleChange();
                handleTransferDialogClose();
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to Transfer Token',
                severity: 'error',
                details: error.message,
            });
        }
    };

    const handleMint = async (event, ticker: string) => {
        event.stopPropagation();
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to mint a token',
                severity: 'error',
            });

            return;
        }
        if (walletBalance < 1) {
            showGlobalSnackbar({
                message: 'You need at least 1 KAS to mint a token',
                severity: 'error',
            });
            return;
        }
        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'mint',
            tick: ticker,
        });
        try {
            const mint = await mintKRC20Token(inscribeJsonString);
            if (mint) {
                const { commitId, revealId } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token Mint successfully',
                    severity: 'success',
                    commitId,
                    revealId,
                });
            }
            handleChange();
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to Mint Token',
                severity: 'error',
                details: error.message,
            });
        }
    };

    const handleItemClick = (token) => {
        navigate(`/token/${token.ticker}`);
    };

    const handleSetAmount = (value) => {
        // Allow empty string for clearing the input
        if (value === '') {
            setAmount('');
            setError('');
            return;
        }
        if (parseInt(value) > parseInt(token.balance)) {
            setError('Insufficient Token Balance');
            return;
        }

        // Replace comma with dot for decimal separator consistency

        if (validatePositiveNumber(value)) {
            setAmount(value);
            setError('');
        } else {
            setError('Please enter a valid number greater than 0 and ONLY NUMBERS');
            // Optionally, you can choose to not update the amount when there's an error
            // setAmount(value);
        }
    };
    const totalBalanceUsd = parseInt(token.balance) * token.price * kasPrice;
    return (
        <div key={token.ticker}>
            <ListItem disablePadding sx={{ height: '12vh' }} onClick={() => handleItemClick(token)}>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                width: '7vh',
                                height: '7vh',
                            }}
                            style={{
                                marginLeft: '0.1vw',
                                borderRadius: 8,
                            }}
                            variant="square"
                            alt={token.ticker}
                            src={token.logoUrl}
                        />
                    </ListItemAvatar>

                    <ListItemText
                        sx={{
                            width: '5vw',
                        }}
                        primary={
                            <Tooltip title={token.ticker}>
                                <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {capitalizeFirstLetter(token.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ width: '13vw' }}
                        primary={
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {token.price ? token.price.toFixed(6) : 0} KAS
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ width: '13vw' }}
                        primary={
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {token.balance}
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ width: '12vw' }}
                        primary={
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {totalBalanceUsd.toFixed(2)} USD
                            </Typography>
                        }
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '26vw',
                            justifyContent: 'center',
                            paddingRight: '6rem',
                        }}
                    >
                        <Button
                            onClick={(event) => handleTransferClick(event, token.ticker)}
                            variant="contained"
                            color="primary"
                            sx={{
                                minWidth: '2vw',
                                width: '4vw',
                                fontSize: '0.6rem',
                            }}
                        >
                            Transfer
                        </Button>
                        {token.state !== 'finished' && (
                            <Button
                                onClick={(event) => handleMint(event, token.ticker)}
                                variant="contained"
                                color="primary"
                                sx={{
                                    minWidth: '2vw',
                                    width: '3vw',
                                    fontSize: '0.6rem',
                                }}
                            >
                                Mint
                            </Button>
                        )}
                    </Box>
                    {/* {token.state !== 'finished' && (
                        <ListItemText
                            sx={{ maxWidth: '10%', display: 'flex', justifyContent: 'center' }}
                            primary={
                                <Button
                                    onClick={(event) => handleMint(event, token.ticker)}
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        minWidth: '2vw',
                                        width: '3vw',
                                        fontSize: '0.6rem',
                                    }}
                                >
                                    Mint
                                </Button>
                            }
                        />
                    )} */}
                </ListItemButton>
            </ListItem>
            <Divider />
            <Dialog
                PaperProps={{
                    sx: {
                        width: '40vw',
                    },
                }}
                open={openTransferDialog}
                onClose={handleTransferDialogClose}
            >
                <DialogTitle>Transfer Token</DialogTitle>
                <DialogContent>
                    {walletConfirmation ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: '1vw' }}>
                                Waiting for wallet confirmation
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="address"
                                label="Destination Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={destAddress}
                                onChange={(e) => setDestAddress(e.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="amount"
                                label="Amount"
                                type="text"
                                fullWidth
                                variant="outlined"
                                error={!!error}
                                helperText={error}
                                value={amount}
                                onChange={(e) => handleSetAmount(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTransferDialogClose}>Cancel</Button>
                    <Button onClick={handleTransfer}>Transfer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TokenRowPortfolio;
