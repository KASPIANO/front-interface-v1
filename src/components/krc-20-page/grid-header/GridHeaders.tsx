import { Box } from '@mui/material';
import { FC } from 'react';
import { GridHeader } from './GridHeader';

interface GridHeadersComponentProps {
    onSortBy: (field: string, asc: boolean) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
    setChangeTotalMintsActive: (value: boolean) => void;
    setChangeMCActive: (value: boolean) => void;
    setChangeTotalHoldersActive: (value: boolean) => void;
}

export const GridHeadersComponent: FC<GridHeadersComponentProps> = (props) => {
    const {
        onSortBy,
        activeHeader,
        setActiveHeader,
        setChangeTotalMintsActive,
        setChangeMCActive,
        setChangeTotalHoldersActive,
    } = props;

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
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Ticker"
                            sortField="ticker"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Age"
                            sortField="creationDate"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Price"
                            sortField="price"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Volume"
                            sortField="volumeUsd"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Market Cap"
                            sortField="marketCap"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Minted"
                            sortField="totalMintedPercent"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
                            name="Holders"
                            sortField="totalHolders"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            setChangeTotalMintsActive={setChangeTotalMintsActive}
                            setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                            setChangeMCActive={setChangeMCActive}
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
