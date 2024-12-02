import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Tooltip, Popover } from '@mui/material';
import GasMeterRoundedIcon from '@mui/icons-material/GasMeterRounded';
import { calculateFee } from '../../utils/Utils';
import { feeEstimate } from '../../DAL/KaspaApiDal';

interface GasFeeComponentProps {
    gasType: 'KAS' | 'KRC20';
    onSelectFee: (selectedFee: number) => void;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const GasFeeSelector: React.FC<GasFeeComponentProps> = (props) => {
    const { gasType, onSelectFee, anchorEl, onClose } = props;
    const [fees, setFees] = useState<{
        low: number;
        average: number;
        priority: number;
    }>({ low: 0, average: 0, priority: 0 });

    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchFees = async () => {
            if (open) {
                const { lowBuckets, normalBuckets, priorityBucket } = await feeEstimate();
                setFees({
                    low: calculateFee(gasType, lowBuckets[0]?.feerate || 0),
                    average: calculateFee(gasType, normalBuckets[0]?.feerate || 0),
                    priority: calculateFee(gasType, priorityBucket?.feerate || 0),
                });
            }
        };
        fetchFees();
    }, [gasType, open]);

    const handleFeeSelect = (fee: number) => {
        onSelectFee(fee);
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            sx={{
                '& .MuiPopover-paper': {
                    p: 1,
                    mt: -1,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e5e7eb',
                },
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={1}>
                <Typography variant="body2" className="text-gray-600">
                    Select Gas Fee
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                    <Tooltip title="Low Fee - Slowest" arrow placement="right">
                        <Button
                            onClick={() => handleFeeSelect(fees.low)}
                            startIcon={<GasMeterRoundedIcon className="text-green-500" />}
                            size="small"
                            className="w-full justify-between"
                            sx={{
                                border: '1px solid #bbf7d0',
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                '& .MuiButton-startIcon': {
                                    marginRight: '4px',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                },
                            }}
                        >
                            Low ({(fees.low / 1e8).toFixed(5)} KAS)
                        </Button>
                    </Tooltip>
                    <Tooltip title="Average Fee - Medium Speed" arrow placement="right">
                        <Button
                            onClick={() => handleFeeSelect(fees.average)}
                            startIcon={<GasMeterRoundedIcon className="text-gray-500" />}
                            size="small"
                            className="w-full justify-between"
                            sx={{
                                border: '1px solid #e5e7eb',
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                '& .MuiButton-startIcon': {
                                    marginRight: '4px',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                },
                            }}
                        >
                            Average ({(fees.average / 1e8).toFixed(5)} KAS)
                        </Button>
                    </Tooltip>
                    <Tooltip title="Priority Fee - Fastest" arrow placement="right">
                        <Button
                            onClick={() => handleFeeSelect(fees.priority)}
                            startIcon={<GasMeterRoundedIcon className="text-red-500" />}
                            size="small"
                            className="w-full justify-between"
                            sx={{
                                border: '1px solid #fecaca',
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                '& .MuiButton-startIcon': {
                                    marginRight: '4px',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                },
                            }}
                        >
                            Priority ({(fees.priority / 1e8).toFixed(5)} KAS)
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
        </Popover>
    );
};

export default GasFeeSelector;
