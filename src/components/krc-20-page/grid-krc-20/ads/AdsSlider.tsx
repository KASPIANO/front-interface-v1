import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AdsRow } from './AdsRow';
import { TokenListItemResponse } from '../../../../types/Types';

interface AdsSliderProps {
    adsData: TokenListItemResponse[];
    handleItemClick: (adData: TokenListItemResponse) => void;
}

export const AdsSlider: FC<AdsSliderProps> = ({ adsData, handleItemClick }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const adChangeInterval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsData.length);
        }, 15000); // Change ad every 15 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(adChangeInterval);
    }, [adsData.length]);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {adsData.map((adData, index) => (
                <Box
                    key={adData.ticker}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transition: 'opacity 1s ease-in-out',
                        opacity: index === currentAdIndex ? 1 : 0,
                        pointerEvents: index === currentAdIndex ? 'auto' : 'none',
                    }}
                >
                    <AdsRow adData={adData} handleItemClick={handleItemClick} />
                </Box>
            ))}
        </Box>
    );
};
