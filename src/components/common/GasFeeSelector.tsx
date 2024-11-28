import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Tooltip, Icon } from '@mui/material';
import GasMeterRoundedIcon from '@mui/icons-material/GasMeterRounded';
import { calculateFee } from '../../utils/Utils';

interface GasFeeComponentProps {
    gasType: 'KAS' | 'KRC20'; // Determines calculation logic
    onSubmit: (selectedFee: number, ...args: any[]) => Promise<void>; // Callback to execute the specific function
    functions: {
        deploy?: (args: any) => Promise<void>;
        mint?: (args: any) => Promise<void>;
        transfer?: (args: any) => Promise<void>;
        createOrder?: (args: any) => Promise<void>;
        buyOrder?: (args: any) => Promise<void>;
        cancelOrder?: (args: any) => Promise<void>;
    };
    feeEstimate: () => Promise<{
        lowBuckets: { feerate: number; estimatedSeconds: number }[];
        normalBuckets: { feerate: number; estimatedSeconds: number }[];
        priorityBucket: { feerate: number; estimatedSeconds: number };
    }>; // Function to fetch gas fee data
    priorityFee?: number; // Additional fee multiplier
    txType: 'DEPLOY' | 'MINT' | 'TRANSFER'; // Transaction type for calculations
    args: any[]; // Arguments for the respective functions
}

const GasFeeSelector: React.FC<GasFeeComponentProps> = ({
    gasType,
    onSubmit,
    functions,
    feeEstimate,
    priorityFee,
    txType,
    args,
}) => {
    const [fees, setFees] = useState<{
        low: number;
        average: number;
        priority: number;
    }>({ low: 0, average: 0, priority: 0 });

    const [selectedFee, setSelectedFee] = useState<number | null>(null);

    useEffect(() => {
        const fetchFees = async () => {
            const { lowBuckets, normalBuckets, priorityBucket } = await feeEstimate();
            setFees({
                low: calculateFee(gasType, lowBuckets[0]?.feerate || 0),
                average: calculateFee(gasType, normalBuckets[0]?.feerate || 0),
                priority: calculateFee(gasType, priorityBucket?.feerate || 0),
            });
        };
        fetchFees();
    }, [feeEstimate, gasType]);

    const handleSelection = async (fee: number) => {
        setSelectedFee(fee);
        await onSubmit(fee, ...args); // Pass fee and other arguments to the selected function
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h6">Choose Gas Fee</Typography>
            <Box display="flex" gap={3}>
                <Tooltip title="Low Fee - Slowest" arrow>
                    <Button
                        variant="contained"
                        onClick={() => handleSelection(fees.low)}
                        sx={{
                            backgroundColor: selectedFee === fees.low ? 'green' : undefined,
                        }}
                        startIcon={<GasMeterRoundedIcon style={{ color: 'green' }} />}
                    >
                        Low ({fees.low} KAS)
                    </Button>
                </Tooltip>
                <Tooltip title="Average Fee - Medium Speed" arrow>
                    <Button
                        variant="contained"
                        onClick={() => handleSelection(fees.average)}
                        sx={{
                            backgroundColor: selectedFee === fees.average ? 'grey' : undefined,
                        }}
                        startIcon={<GasMeterRoundedIcon style={{ color: 'grey' }} />}
                    >
                        Average ({fees.average} KAS)
                    </Button>
                </Tooltip>
                <Tooltip title="Priority Fee - Fastest" arrow>
                    <Button
                        variant="contained"
                        onClick={() => handleSelection(fees.priority)}
                        sx={{
                            backgroundColor: selectedFee === fees.priority ? 'red' : undefined,
                        }}
                        startIcon={<GasMeterRoundedIcon style={{ color: 'red' }} />}
                    >
                        Priority ({fees.priority} KAS)
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default GasFeeSelector;
