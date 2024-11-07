import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AdsRow } from './AdsRow';
import { AdsListItemResponse } from '../../../../types/Types';

interface AdsSliderProps {
    adsData: AdsListItemResponse[];
    handleItemClick: (adData: any) => void;
    walletBalance: number;
    walletConnected: boolean;
}

export const AdsSlider: FC<AdsSliderProps> = ({ adsData, handleItemClick, walletBalance, walletConnected }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const adChangeInterval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsData.length);
        }, 15000); // Change ad every 15 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(adChangeInterval);
    }, [adsData.length]);

    const currentAd = adsData[currentAdIndex];

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            <Box
                key={currentAd.ticker}
                sx={{
                    width: '100%',
                    transition: 'opacity 5s ease-in-out',
                    opacity: 1,
                    pointerEvents: 'auto',
                }}
            >
                <AdsRow
                    adData={currentAd}
                    handleItemClick={handleItemClick}
                    walletBalance={walletBalance}
                    walletConnected={walletConnected}
                />
            </Box>
        </Box>
    );
};
