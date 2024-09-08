import { Box } from '@mui/material';
import { FC } from 'react';
import { GridHeader } from './GridHeader';
import { FilterState } from '../../../types/Types';

interface GridHeadersComponentProps {
    headerFunction: (field: string, state: FilterState) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
    filterStates: Record<string, FilterState>;
}

export const GridHeadersComponent: FC<GridHeadersComponentProps> = ({
    headerFunction,
    activeHeader,
    setActiveHeader,
    filterStates,
}) => (
    <Box
        sx={{
            height: '8vh',
            alignContent: 'center',
            borderBottom: '0.1px solid  rgba(111, 199, 186, 0.3)',
        }}
    >
        <table style={{ width: '100%' }}>
            <thead>
                <tr style={{ display: 'flex' }}>
                    <GridHeader
                        name="Ticker"
                        headerFunction={(state) => headerFunction('ticker', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['ticker'] || FilterState.NONE}
                    />
                    <GridHeader
                        name="Age"
                        headerFunction={(state) => headerFunction('creationDate', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['creationDate'] || FilterState.NONE}
                    />
                    <GridHeader
                        name="Supply"
                        headerFunction={(state) => headerFunction('supply', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['supply'] || FilterState.NONE}
                    />
                    <GridHeader
                        name="Minted"
                        headerFunction={(state) => headerFunction('totalMintedPercent', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['totalMintedPercent'] || FilterState.NONE}
                    />
                    <GridHeader
                        name="Holders"
                        headerFunction={(state) => headerFunction('totalHolders', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['totalHolders'] || FilterState.NONE}
                    />
                    <GridHeader
                        name="Fair Mint"
                        headerFunction={(state) => headerFunction('fairMint', state)}
                        activeHeader={activeHeader}
                        setActiveHeader={setActiveHeader}
                        currentFilterState={filterStates['fairMint'] || FilterState.NONE}
                    />
                </tr>
            </thead>
        </table>
    </Box>
);
