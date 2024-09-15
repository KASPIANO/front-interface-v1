import { FC } from 'react';
import { Box, Button, Card, Tooltip, Typography } from '@mui/material';
import { BackendTokenResponse } from '../../../types/Types';
import { getCurrentAccount, mintKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { fetchTokenByTicker } from '../../../DAL/BackendDAL';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';
import { setWalletBalanceUtil } from '../../../utils/Utils';

interface MintingComponentProps {
    tokenInfo: BackendTokenResponse;
    walletConnected: boolean;
    walletBalance: number;
    walletAddress: string | null;
    setTokenInfo: (tokenInfo: BackendTokenResponse) => void;
    setWalletBalance: (balance: number) => void;
}

const MintingComponent: FC<MintingComponentProps> = (props) => {
    const { tokenInfo, walletConnected, walletBalance, setWalletBalance, setTokenInfo, walletAddress } = props;
    // Calculate the total mints possible and mints left
    const totalMintableSupply = tokenInfo.totalSupply - tokenInfo.preMintedSupply;
    const totalMintsPossible = Math.floor(totalMintableSupply / tokenInfo.mintLimit);
    const mintsLeft = totalMintsPossible - tokenInfo.totalMintTimes;
    const isMintingDisabled = tokenInfo.totalMinted >= tokenInfo.totalSupply;

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
                console.log(mint);
                const { commit, reveal } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token minted successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
            const account = await getCurrentAccount();
            const updatedTokenData = await fetchTokenByTicker(ticker, walletAddress, false);
            const balance = await fetchWalletBalance(account);
            setWalletBalance(setWalletBalanceUtil(balance));
            setTokenInfo(updatedTokenData);
        } catch (error) {
            showGlobalSnackbar({
                message: 'Token minting failed',
                severity: 'error',
                details: error.message,
            });
        }
    };

    const limitPerMint = tokenInfo.mintLimit;
    return (
        <Card
            sx={{
                padding: '8px 10px',
                height: '20vh',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    MINT STATUS
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9vw' }}>
                    Limit Per Mint: {limitPerMint}
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
                            {tokenInfo.totalMintTimes} / {totalMintsPossible}
                        </Typography>
                    </Box>

                    {/* Mints Left */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '1vw', fontWeight: 'bold' }}>Mints Left</Typography>
                        <Typography sx={{ fontSize: '1vw' }}>{mintsLeft}</Typography>
                    </Box>
                </Box>
                {/* Right Side: Mint Button */}
                <Tooltip
                    title={
                        !walletConnected
                            ? 'Please connect your wallet to mint a token'
                            : walletBalance < 1
                              ? 'You need at least 1 KAS to mint a token'
                              : isMintingDisabled
                                ? 'This token is sold out'
                                : ''
                    }
                >
                    <span>
                        <Button
                            onClick={() => handleMint(tokenInfo.ticker)}
                            variant="contained"
                            color="primary"
                            style={{
                                fontSize: '0.8vw',
                                width: '100%',
                            }}
                            disabled={isMintingDisabled || !walletConnected || walletBalance < 1}
                        >
                            {isMintingDisabled ? 'Sold Out' : 'Mint'}
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Card>
    );
};

export default MintingComponent;
