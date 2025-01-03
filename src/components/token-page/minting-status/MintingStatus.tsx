import { FC, useEffect, useRef, useState } from 'react';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import { BackendTokenResponse } from '../../../types/Types';
import { mintKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { fetchTokenByTicker } from '../../../DAL/BackendDAL';
import { StyledMintButton } from './MintingStatus.s';
import GasFeeSelector from '../../common/GasFeeSelector';
import { kaspaFeeEstimate } from '../../../DAL/KaspaApiDal';

interface MintingComponentProps {
    tokenInfo: BackendTokenResponse;
    walletConnected: boolean;
    walletBalance: number;
    walletAddress: string | null;
    setTokenInfo: (tokenInfo: BackendTokenResponse) => void;
}

const MintingComponent: FC<MintingComponentProps> = (props) => {
    const { tokenInfo, walletConnected, walletBalance, setTokenInfo, walletAddress } = props;
    // Calculate the total mints possible and mints left
    const [mintSuccessful, setMintSuccessful] = useState(false);
    const totalMintableSupply = tokenInfo.totalSupply - tokenInfo.preMintedSupply;
    const totalMintsPossible = Math.floor(totalMintableSupply / tokenInfo.mintLimit);
    const mintsLeft = totalMintsPossible - tokenInfo.totalMintTimes;
    const isMintingDisabled = tokenInfo.totalMinted >= tokenInfo.totalSupply;
    const isSoldOut = tokenInfo.state === 'finished';
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (mintSuccessful) {
            const timer = setTimeout(async () => {
                setMintSuccessful(false);
                try {
                    const updatedTokenData = await fetchTokenByTicker(tokenInfo.ticker, walletAddress, true);
                    setTokenInfo(updatedTokenData);
                } catch (error) {
                    console.error('Error updating data after mint:', error);
                }
            }, 12000); // 12000 milliseconds = 12 seconds

            // Cleanup function to clear the timeout if the component unmounts
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mintSuccessful]);

    const handleMint = async (ticker: string, priorityFee?: number) => {
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to mint a token',
                severity: 'error',
            });

            return;
        }
        if (walletBalance < 1) {
            showGlobalSnackbar({
                message: 'You need at least 3 KAS to mint a token',
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
            const mint = await mintKRC20Token(inscribeJsonString, ticker, priorityFee);
            if (mint) {
                const { commitId, revealId } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token minted successfully',
                    severity: 'success',
                    commitId,
                    revealId,
                });
            }
            setMintSuccessful(true);
        } catch (error) {
            showGlobalSnackbar({
                message: 'Token minting failed',
                severity: 'error',
                details: error.message,
            });
        }
    };
    const mintButtonRef = useRef<HTMLButtonElement | null>(null);

    const gasHandlerMint = async (ticker) => {
        const fee = await kaspaFeeEstimate();
        if (fee === 1) {
            handleMint(ticker);
        } else {
            setAnchorEl(mintButtonRef.current);
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
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                >
                    MINT STATUS
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
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
                {/* Total Mints */}
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
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Total Mints</Typography>
                        <Typography sx={{ fontSize: '0.7rem' }}>
                            {isSoldOut ? totalMintsPossible : tokenInfo.totalMintTimes} / {totalMintsPossible}
                        </Typography>
                    </Box>

                    {/* Mints Left */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Mints Left</Typography>
                        <Typography sx={{ fontSize: '0.7rem' }}>{isSoldOut ? '0' : mintsLeft}</Typography>
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
                        <StyledMintButton
                            ref={mintButtonRef}
                            onClick={() => gasHandlerMint(tokenInfo.ticker)}
                            variant="contained"
                            color="primary"
                            style={{
                                fontSize: '0.7rem',
                                width: '100%',
                            }}
                            sx={{ mt: '0.5rem' }}
                            disabled={isMintingDisabled || !walletConnected || walletBalance < 1 || isSoldOut}
                        >
                            {isMintingDisabled || isSoldOut ? 'Sold Out' : 'Mint'}
                        </StyledMintButton>
                    </span>
                </Tooltip>
                <GasFeeSelector
                    gasType="KRC20"
                    onSelectFee={(selectedFee) => {
                        handleMint(tokenInfo.ticker, selectedFee);
                        setAnchorEl(null);
                    }}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                />
            </Box>
        </Card>
    );
};

export default MintingComponent;
