import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, useTheme } from '@mui/material';
import {
    useLaunchpadOwnerInfo,
    useRetrieveFunds,
    useStartLaunchpad,
    useStopLaunchpad,
} from '../../../DAL/LaunchPadQueries';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import { LunchpadWalletType, TransferObj } from '../../../types/Types';
import { fetchWalletKRC20Balance } from '../../../DAL/Krc20DAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { sendKaspa, transferKRC20Token } from '../../../utils/KaswareUtils';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';
import ExpandedView from './ExpandedLaunchpad';
import { useQueryClient } from '@tanstack/react-query';
import { convertToProtocolFormat } from '../../../utils/Utils';

type LaunchpadCardProps = {
    ticker: string;
    availabeUnits: number;
    kasPerUnit: number;
    tokenPerUnit: number;
    status: string;
    walletAddress: string;
};

const KASPA_TO_SOMPI = 100000000;

const LaunchpadCard: React.FC<LaunchpadCardProps> = ({
    ticker,
    availabeUnits,
    kasPerUnit,
    tokenPerUnit,
    status,
    walletAddress,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [fundTokensAmount, setFundTokensAmount] = useState('');
    const [fundGasAmount, setFundGasAmount] = useState('');
    const [isTokensFunding, setIsTokensFunding] = useState(false);
    const [isGasFunding, setIsGasFunding] = useState(false);
    const [retrieveFundType, setRetrieveFundType] = useState('');
    const { data: expandedData, isLoading, error } = useLaunchpadOwnerInfo(ticker, walletAddress);
    const theme = useTheme();
    const startLaunchpadMutation = useStartLaunchpad(ticker, walletAddress);
    const stopLaunchpadMutation = useStopLaunchpad(ticker, walletAddress);
    const retrieveFundsMutation = useRetrieveFunds(ticker);

    const handleStartStop = () => {
        if (expandedData?.lunchpad.status === 'INACTIVE') {
            startLaunchpadMutation.mutate(expandedData.lunchpad.id);
        } else {
            stopLaunchpadMutation.mutate(expandedData.lunchpad.id);
        }
    };

    const handleRetrieveFunds = async (walletType: LunchpadWalletType) => {
        setRetrieveFundType(walletType);
        await retrieveFundsMutation.mutateAsync({ id: expandedData.lunchpad.id, walletType });
        setRetrieveFundType('');
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
    };

    const handleFund = async (fundType: string) => {
        if (fundType === 'tokens') {
            handleFundTokens();
        } else {
            handleFundGas();
        }
    };

    const queryClient = useQueryClient();

    const handleFundTokens = async () => {
        const balance = await fetchWalletKRC20Balance(walletAddress, ticker);
        if (Number(fundTokensAmount) > balance) {
            showGlobalSnackbar({ message: 'Insufficient Token balance', severity: 'error' });
            return;
        }
        if (fundTokensAmount === '') {
            showGlobalSnackbar({ message: 'Please enter an amount', severity: 'error' });
            return;
        }

        setIsTokensFunding(true);
        try {
            const inscribeJsonString: TransferObj = {
                p: 'KRC-20',
                op: 'transfer',
                tick: ticker,
                amt: convertToProtocolFormat(fundTokensAmount),
                to: expandedData.lunchpad.senderWalletAddress,
            };
            const jsonStringified = JSON.stringify(inscribeJsonString);
            await transferKRC20Token(jsonStringified);
            showGlobalSnackbar({ message: 'Tokens funded successfully', severity: 'success' });
            queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
        } catch (error) {
            console.error('Error funding tokens:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setIsTokensFunding(false);
            setFundTokensAmount('');
        }
    };

    const handleFundGas = async () => {
        const balance = await fetchWalletBalance(walletAddress);
        if (Number(fundGasAmount) > balance) {
            showGlobalSnackbar({ message: 'Insufficient Kas balance', severity: 'error' });
            return;
        }
        if (fundGasAmount === '') {
            showGlobalSnackbar({ message: 'Please enter an amount', severity: 'error' });
            return;
        }

        setIsGasFunding(true);
        try {
            const sompiAmount = parseInt(fundGasAmount) * KASPA_TO_SOMPI;
            await sendKaspa(expandedData.lunchpad.senderWalletAddress, sompiAmount);
            showGlobalSnackbar({ message: 'Kas funded successfully', severity: 'success' });
            queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
        } catch (error) {
            console.error('Error funding tokens:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setIsGasFunding(false);
            setFundGasAmount('');
        }
    };

    const validateNumbersOnly = (value: string) => {
        if (value === '') {
            return true; // Allow empty input
        }
        const regex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/; // Allows integers and up to 2 decimals
        return regex.test(value);
    };

    return (
        <>
            <Card
                sx={{
                    width: 300,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                    cursor: 'pointer',
                }}
                onClick={handleExpand}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" component="div">
                            {ticker}
                        </Typography>
                        <IconButton
                            aria-label="expand"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click event
                                handleExpand();
                            }}
                            sx={{
                                padding: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <OpenWithRoundedIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Available Units: {availabeUnits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        KAS per Unit: {kasPerUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tokens per Unit: {tokenPerUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Status: {status}
                    </Typography>
                </CardContent>
            </Card>
            {isExpanded && (
                <ExpandedView
                    isExpanded={isExpanded}
                    onClose={handleClose}
                    isLoading={isLoading}
                    error={error}
                    expandedData={expandedData}
                    handleStartStop={handleStartStop}
                    handleRetrieveFunds={handleRetrieveFunds}
                    fundTokensAmount={fundTokensAmount}
                    setFundTokensAmount={setFundTokensAmount}
                    fundGasAmount={fundGasAmount}
                    setFundGasAmount={setFundGasAmount}
                    handleFund={handleFund}
                    isTokensFunding={isTokensFunding}
                    isGasFunding={isGasFunding}
                    validateNumbersOnly={validateNumbersOnly}
                    startLaunchpadMutation={startLaunchpadMutation}
                    stopLaunchpadMutation={stopLaunchpadMutation}
                    retrieveFundsMutation={retrieveFundsMutation}
                    theme={theme}
                    retrieveFundType={retrieveFundType}
                />
            )}
        </>
    );
};

export default LaunchpadCard;
