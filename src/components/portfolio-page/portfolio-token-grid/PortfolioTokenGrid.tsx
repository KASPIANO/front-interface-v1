import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';
import { TokenRowPortfolioItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioTokenGrid.s';
import TokenRowPortfolio from '../token-row-portfolio/TokenRowPortfolio';

interface PortfolioTokenGridProps {
    tokensList: TokenRowPortfolioItem[];
    kasPrice: number;
    walletConnected: boolean;
}

enum GridHeaders {
    TICKER = 'TICKER',
    PRICE = 'PRICE',
    TOTAL_VALUE = 'TOTAL VALUE',
    ACTIONS = 'ACTIONS',
}

const PortfolioTokenGrid: FC<PortfolioTokenGridProps> = (props) => {
    const { tokensList, kasPrice, walletConnected } = props;

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
            }}
        >
            <Table style={{ width: '90%' }}>
                <TableHead>
                    <TableRow>
                        {Object.keys(GridHeaders).map((header) => (
                            <TableCell key={header} style={{ width: '25%' }}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
            </Table>
        </Box>
    );

    return (
        <StyledPortfolioGridContainer>
            <GlobalStyle />
            {tableHeader}
            <List
                dense
                sx={{
                    width: '100%',
                    overflowX: 'hidden',
                    height: '70vh',
                }}
            >
                {tokensList.length > 0 ? (
                    tokensList.map((token) => (
                        <TokenRowPortfolio
                            key={token.ticker}
                            token={token}
                            walletConnected={walletConnected}
                            kasPrice={kasPrice}
                        />
                    ))
                ) : (
                    <Skeleton width={'100%'} height={'12vh'} />
                )}
            </List>
            {tokensList.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '1vw' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioTokenGrid;
