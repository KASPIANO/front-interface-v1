import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AdsRow } from './AdsRow';
import { AdsListItemResponse } from '../../../../types/Types';

interface AdsSliderProps {
    adsData: AdsListItemResponse[];
    handleItemClick: (telegram: string, ticker: string) => void;
}

export const AdsSlider: FC<AdsSliderProps> = ({ adsData, handleItemClick }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [intervalActive, setIntervalActive] = useState(true);

    const extendedAdsData = [...adsData, adsData[0]];

    const handleTransitionEnd = () => {
        if (currentAdIndex === adsData.length) {
            setIsTransitioning(false);
            setCurrentAdIndex(0);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setIntervalActive(true); // Resume interval
            } else {
                setIntervalActive(false); // Pause interval
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (!intervalActive) return;

        const adChangeInterval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentAdIndex((prev) => prev + 1);
        }, 15000);

        return () => clearInterval(adChangeInterval);
    }, [intervalActive]);

    return (
        <Box sx={{ width: '100vw', overflow: 'hidden', position: 'relative' }}>
            <Box
                sx={{
                    display: 'flex',
                    transform: `translateX(-${currentAdIndex * 100}vw)`,
                    transition: isTransitioning ? 'transform 4s ease-in-out' : 'none',
                    width: `${extendedAdsData.length * 100}vw`,
                }}
                onTransitionEnd={handleTransitionEnd}
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
