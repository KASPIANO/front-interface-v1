import { Box } from '@mui/material';
import { FC } from 'react';
import { GridHeader } from './GridHeader';

interface GridHeadersComponentProps {
    onSortBy: (field: string, asc: boolean) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
}

export const GridHeadersComponent: FC<GridHeadersComponentProps> = (props) => {
    const { onSortBy, activeHeader, setActiveHeader } = props;

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
                            name="Ticker"
                            sortField="ticker"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            name="Age"
                            sortField="creationDate"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            name="Supply"
                            sortField="supply"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            name="Minted"
                            sortField="totalMintedPercent"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
                            name="Holders"
                            sortField="totalHolders"
                            onSortBy={onSortBy}
                            activeHeader={activeHeader}
                            setActiveHeader={setActiveHeader}
                        />
                        <GridHeader
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
