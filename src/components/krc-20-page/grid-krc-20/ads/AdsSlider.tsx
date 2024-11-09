import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AdsRow } from './AdsRow';
import { AdsListItemResponse } from '../../../../types/Types';

interface AdsSliderProps {
    adsData: AdsListItemResponse[];
    handleItemClick: (adData: any) => void;
}

export const AdsSlider: FC<AdsSliderProps> = ({ adsData, handleItemClick }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Create a new ads array with the first ad duplicated at the end
    const extendedAdsData = [...adsData, adsData[0]];

    useEffect(() => {
        const adChangeInterval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => prevIndex + 1);
            setIsTransitioning(true);
        }, 18000); // Change ad every 15 seconds

        return () => clearInterval(adChangeInterval);
    }, []);

    // Check if we need to reset to the first ad (index 0) when reaching the duplicate
    useEffect(() => {
        if (currentAdIndex === adsData.length) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentAdIndex(0);
            }, 3000); // Timeout should match transition duration

            return () => clearTimeout(timeout);
        }
        setIsTransitioning(true);
    }, [currentAdIndex, adsData.length]);

    return (
        <Box sx={{ width: '100vw', overflow: 'hidden', position: 'relative' }}>
            <Box
                sx={{
                    display: 'flex',
                    transform: `translateX(-${currentAdIndex * 100}vw)`,
                    transition: isTransitioning ? 'transform 3s ease-in-out' : 'none',
                    width: `${extendedAdsData.length * 100}vw`,
                }}
            >
                {extendedAdsData.map((ad, index) => (
                    <Box key={`${ad.ticker}-${index}`} sx={{ width: '100vw', flexShrink: 0 }}>
                        <AdsRow adData={ad} handleItemClick={handleItemClick} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
