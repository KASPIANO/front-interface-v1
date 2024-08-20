import { FC } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import { Token } from '../../../types/Types';
import { mintKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';

interface MintingComponentProps {
    tokenInfo: Token;
    walletConnected: boolean;
    walletBalance: number;
}

const MintingComponent: FC<MintingComponentProps> = (props) => {
    const { tokenInfo, walletConnected, walletBalance } = props;
    // Calculate the total mints possible and mints left
    const totalMintsPossible = Math.floor(parseFloat(tokenInfo.max) / parseFloat(tokenInfo.lim));
    const mintsLeft = totalMintsPossible - parseInt(tokenInfo.mintTotal);
    const isMintingDisabled = parseFloat(tokenInfo.minted) >= parseFloat(tokenInfo.max);

    const handleMint = async (ticker: string) => {
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
                const { commit, reveal } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token minted successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Token minting failed',
                severity: 'error',
                details: error.message,
            });
        }
    };
    return (
        <Card
            sx={{
                padding: '8px 10px',
                height: '20vh',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                    MINT STATUS
                </Typography>
            </Box>
            {/* Left Side: Minting Info */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '12vh',
                    rowGap: '1vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '0.5vh',
                        justifyContent: 'center',
                        columnGap: '1vw',
                    }}
                >
                    {/* Total Mints */}
                    <Box sx={{ marginRight: '2vw', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '1vw', fontWeight: 'bold' }}>Total Mints</Typography>
                        <Typography sx={{ fontSize: '1vw' }}>
                            {tokenInfo.mintTotal} / {totalMintsPossible}
                        </Typography>
                    </Box>

                    {/* Mints Left */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '1vw', fontWeight: 'bold' }}>Mints Left</Typography>
                        <Typography sx={{ fontSize: '1vw' }}>{mintsLeft}</Typography>
                    </Box>
                </Box>
                {/* Right Side: Mint Button */}
                <Button
                    onClick={() => handleMint(tokenInfo.tick)}
                    variant="contained"
                    color="primary"
                    style={{
                        fontSize: '0.8vw',
                    }}
                    disabled={isMintingDisabled || !walletConnected || walletBalance < 1}
                >
                    {isMintingDisabled ? 'Sold Out' : 'Mint'}
                </Button>
            </Box>
        </Card>
    );
};

export default MintingComponent;
