import { Box } from '@mui/material';
import { FC } from 'react';
import { GridHeader } from './GridHeader';

interface GridHeadersComponentProps {
    onSortBy: (field: string, asc: boolean) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
    setChangeTotalMintsActive: (value: boolean) => void;
}

export const GridHeadersComponent: FC<GridHeadersComponentProps> = (props) => {
    const { onSortBy, activeHeader, setActiveHeader, setChangeTotalMintsActive } = props;

    return (
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
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Ticker"
                            sortField="ticker"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Age"
                            sortField="creationDate"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Market Cap"
                            sortField="marketCap"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Minted"
                            sortField="totalMintedPercent"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Holders"
                            sortField="totalHolders"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            name="Fair Mint"
                            sortField="fairMint"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                    </tr>
                </thead>
            </table>
        </Box>
    );
};
