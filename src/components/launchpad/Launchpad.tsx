import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Typography,
    Slider,
    Button,
    LinearProgress,
    CircularProgress,
    useTheme,
    TextField,
    Tooltip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
    useCancelOrder,
    useCreateLaunchpadOrder,
    useIsWhitelisted,
    useLaunchpad,
    useVerifyAndProcessOrder,
} from '../../DAL/LaunchPadQueries';
import { showGlobalSnackbar } from '../alert-context/AlertContext';
import { sendKaspa } from '../../utils/KaswareUtils';
import { handleLaunchpadError } from '../../utils/ErrorHandling';
import GasFeeSelector from '../common/GasFeeSelector';
import { kaspaFeeEstimate } from '../../DAL/KaspaApiDal';

type LaunchpadProps = {
    walletBalance: number;
    walletAddress: string;
    backgroundBlur: boolean;
    walletConnected: boolean;
};

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi

const Launchpad: React.FC<LaunchpadProps> = (props) => {
    const { ticker } = useParams();
    const { walletBalance, backgroundBlur, walletConnected } = props;
    const { data: launchpad, isLoading, error } = useLaunchpad(ticker);
    const { data: allowed, isLoading: whitelistLoading } = useIsWhitelisted(ticker);
    const createOrderMutation = useCreateLaunchpadOrder(ticker);
    const verifyAndProcessMutation = useVerifyAndProcessOrder(ticker);
    const cancelOrderMutation = useCancelOrder(ticker);

    const [selectedUnits, setSelectedUnits] = useState(1);
    const [effectiveMaxUnits, setEffectiveMaxUnits] = useState(1);
    const [soldPercentage, setSoldPercentage] = useState(0);
    const [kaspaNeeded, setKaspaNeeded] = useState(0);
    const [tokensReceived, setTokensReceived] = useState(0);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const theme = useTheme();
    const purchaseButtonRef = useRef<HTMLButtonElement | null>(null);
    const handleCancelOrder = useCallback(
        async (orderIdToCancel: string) => {
            await cancelOrderMutation.mutateAsync(orderIdToCancel);
            setOrderId(null);
            setSelectedUnits(1);
        },
        [cancelOrderMutation],
    );

    const orderIdRef = useRef(orderId);
    const handleCancelOrderRef = useRef(handleCancelOrder);

    // Update refs when values change
    useEffect(() => {
        orderIdRef.current = orderId;
    }, [orderId]);

    useEffect(() => {
        handleCancelOrderRef.current = handleCancelOrder;
    }, [handleCancelOrder]);

    // Cleanup effect that runs on unmount
    useEffect(
        () => () => {
            if (orderIdRef.current) {
                handleCancelOrderRef.current(orderIdRef.current).catch((error) => {
                    console.error('Error cancelling order on unmount:', error);
                });
            }
        },
        [],
    );

    useEffect(() => {
        if (launchpad) {
            // Destructure launchpad data
            const { availabeUnits, totalUnits, maxUnitsPerOrder, minUnitsPerOrder, kasPerUnit, tokenPerUnit } =
                launchpad;

            // Calculate effective max units based on availability
            const maxUnits = Math.min(maxUnitsPerOrder, availabeUnits);
            setEffectiveMaxUnits(maxUnits);

            // Calculate sold percentage
            const soldPercent = totalUnits > 0 ? ((totalUnits - availabeUnits) / totalUnits) * 100 : 0;
            setSoldPercentage(soldPercent);

            // Adjust selectedUnits if it's out of bounds
            setSelectedUnits((prevUnits) => {
                const adjustedUnits = Math.min(Math.max(prevUnits, minUnitsPerOrder), maxUnits);
                return isNaN(adjustedUnits) || adjustedUnits < minUnitsPerOrder ? minUnitsPerOrder : adjustedUnits;
            });

            // Determine if purchasing is possible

            // Calculate initial Kaspa needed and tokens received
            setKaspaNeeded(selectedUnits * kasPerUnit);
            setTokensReceived(selectedUnits * tokenPerUnit);
        }
    }, [launchpad, selectedUnits]);

    // Update kaspaNeeded and tokensReceived when selectedUnits changes
    useEffect(() => {
        if (launchpad) {
            const { kasPerUnit = 0, tokenPerUnit = 0 } = launchpad;
            setKaspaNeeded(selectedUnits * kasPerUnit);
            setTokensReceived(selectedUnits * tokenPerUnit);
        }
    }, [selectedUnits, launchpad]);

    useEffect(() => {
        if (launchpad && !whitelistLoading && !allowed.success) {
            const simulatedError = {
                response: {
                    data: {
                        success: false, // Explicitly indicate failure
                        errorCode: allowed.errorCode, // Default to the whitelist error code
                    },
                },
            };
            handleLaunchpadError(simulatedError);
        }
    }, [launchpad, whitelistLoading, allowed]);

    const handlePurchase = async (priorityFee?: number) => {
        if (walletBalance < kaspaNeeded) {
            showGlobalSnackbar({
                message: 'Insufficient balance',
                severity: 'error',
            });
            return;
        }

        try {
            const orderResult = await createOrderMutation.mutateAsync(selectedUnits);
            if (orderResult.success) {
                setOrderId(orderResult.lunchpadOrder.id);
                const updatedKaspaNeeded =
                    orderResult.lunchpadOrder.kasPerUnit * orderResult.lunchpadOrder.totalUnits;
                const kaspaToSompi = updatedKaspaNeeded * KASPA_TO_SOMPI;
                if (selectedUnits !== orderResult.lunchpadOrder.totalUnits) {
                    showGlobalSnackbar({
                        message: `Only ${orderResult.lunchpadOrder.totalUnits} units available. Purchase adjusted.`,
                        severity: 'warning',
                    });
                }
                setKaspaNeeded(updatedKaspaNeeded);
                setTokensReceived(orderResult.lunchpadOrder.totalUnits * orderResult.lunchpadOrder.tokenPerUnit);
                try {
                    const txData = await sendKaspa(launchpad.walletAddress, kaspaToSompi, priorityFee);
                    const parsedTxData = JSON.parse(txData);
                    const txId = parsedTxData.id;
                    try {
                        await verifyAndProcessMutation.mutateAsync({
                            orderId: orderResult.lunchpadOrder.id,
                            transactionId: txId,
                        });
                    } catch (error) {
                        handleCleanFields();
                    }
                } catch (error) {
                    showGlobalSnackbar({
                        message: 'Failed to send Kaspa. Please try again.',
                        severity: 'error',
                        details: error.message,
                    });
                    // Optionally, you might want to cancel the order here
                    handleCancelOrder(orderResult.lunchpadOrder.id);
                }
                handleCleanFields();
            } else {
                handleCleanFields();
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'An error occurred during the purchase. Please try again.',
                severity: 'error',
            });
            handleCleanFields();
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading Launchpad Data...
                </Typography>
            </Box>
        );
    }

    if (error || !launchpad) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="body1" color="error">
                    Error loading launchpad data. Please try again later.
                </Typography>
            </Box>
        );
    }

    const handleCleanFields = () => {
        setSelectedUnits(1);
        setOrderId(null);
    };
    // Destructure launchpad data for rendering
    const handleUnitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = parseInt(inputValue, 10);

        if (!isNaN(numericValue)) {
            if (numericValue < launchpad.minUnitsPerOrder) {
                setSelectedUnits(launchpad.minUnitsPerOrder);
            } else if (numericValue > effectiveMaxUnits) {
                setSelectedUnits(effectiveMaxUnits);
            } else {
                setSelectedUnits(numericValue);
            }
        }
    };

    const gasHandlerPurchase = async () => {
        const fee = await kaspaFeeEstimate();
        if (fee === 1) {
            handlePurchase();
        } else {
            setAnchorEl(purchaseButtonRef.current);
        }
    };

    return (
        <div
            style={{
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    paddingBottom: 2,
                    paddingTop: 2,
                    gap: 4,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: 500,
                }}
            >
                {/* Ticker and Progress */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {ticker.toUpperCase()}
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: '1rerm' }} gutterBottom>
                        Available Tokens: {launchpad.availabeUnits}
                    </Typography>
                    <Typography sx={{ fontSize: '1rerm' }} gutterBottom>
                        Progress: {soldPercentage.toFixed(2)}% Sold
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={soldPercentage}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>

                {launchpad.availabeUnits ? (
                    <>
                        {/* Slider */}
                        <Box sx={{ width: '100%' }}>
                            <Typography gutterBottom sx={{ fontSize: '1rerm' }}>
                                Select Units (Min: {launchpad.minUnitsPerOrder}, Max: {effectiveMaxUnits})
                            </Typography>
                            <Slider
                                value={selectedUnits}
                                onChange={(_event, value) => setSelectedUnits(value as number)}
                                min={launchpad.minUnitsPerOrder}
                                max={effectiveMaxUnits}
                                step={1}
                                marks
                                disabled={
                                    !walletConnected ||
                                    createOrderMutation.isPending ||
                                    verifyAndProcessMutation.isPending
                                }
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 2,
                                }}
                            >
                                <Typography variant="body2">Selected Units: {selectedUnits}</Typography>
                                <TextField
                                    type="number"
                                    label="Enter Units"
                                    value={selectedUnits}
                                    onChange={handleUnitInputChange}
                                    inputProps={{
                                        min: launchpad.minUnitsPerOrder,
                                        max: effectiveMaxUnits,
                                        step: 1,
                                    }}
                                    disabled={
                                        !walletConnected ||
                                        createOrderMutation.isPending ||
                                        verifyAndProcessMutation.isPending
                                    }
                                    sx={{ width: '120px' }}
                                />
                            </Box>
                        </Box>

                        {/* Summary */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Kaspa Needed: {kaspaNeeded} KAS
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Tokens Received: {tokensReceived} {ticker}
                            </Typography>
                        </Box>

                        {/* Purchase Button */}
                        <Tooltip
                            title={
                                !walletConnected
                                    ? 'Please connect your wallet to proceed with the purchase.'
                                    : !allowed.success
                                      ? 'You are not whitelisted to participate in this launchpad.'
                                      : ''
                            }
                        >
                            <span>
                                <Button
                                    ref={purchaseButtonRef}
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: '100%' }}
                                    onClick={gasHandlerPurchase}
                                    disabled={
                                        selectedUnits > effectiveMaxUnits ||
                                        selectedUnits < launchpad.minUnitsPerOrder ||
                                        !walletConnected ||
                                        walletBalance < kaspaNeeded ||
                                        createOrderMutation.isPending ||
                                        verifyAndProcessMutation.isPending ||
                                        !!orderId ||
                                        !allowed.success
                                    }
                                >
                                    {!allowed.success
                                        ? 'User not in Whitelist'
                                        : createOrderMutation.isPending
                                          ? 'Creating Order...'
                                          : verifyAndProcessMutation.isPending
                                            ? 'Processing...'
                                            : orderId
                                              ? 'Order Pending'
                                              : 'Purchase'}
                                </Button>
                            </span>
                        </Tooltip>

                        {/* Cancel Button */}
                    </>
                ) : (
                    <Typography variant="h6" color="textSecondary" align="center">
                        No units available for purchase at this time.
                    </Typography>
                )}
            </Box>
            <GasFeeSelector
                gasType="KAS"
                onSelectFee={(selectedFee) => {
                    handlePurchase(selectedFee);
                    setAnchorEl(null);
                }}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            />
        </div>
    );
};

export default Launchpad;
