/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, List } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenListItemResponse } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { TokenRow } from '../token-row-grid/TokenRow';
import { GridHeadersComponent } from '../grid-header/GridHeaders';
import { useGetCurrentAds } from '../../../DAL/UseQueriesBackend';
import { AdsSlider } from './ads/AdsSlider';

interface TokenDataGridProps {
    tokensList: TokenListItemResponse[];
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
    sortBy: (field: string, asc: boolean) => void;
    timeInterval?: string;
    isLoading: boolean;
    error: any;
    setActiveHeader: (value: string) => void;
    activeHeader: string;
    setChangeTotalMintsActive: (value: boolean) => void;
}

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const {
        tokensList,
        walletBalance,
        walletConnected,
        sortBy,
        walletAddress,
        isLoading,
        error,
        setActiveHeader,
        activeHeader,
        setChangeTotalMintsActive,
    } = props;
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.ticker}`);
    };

    const { data: adsData, isLoading: isAdsLoading } = useGetCurrentAds('main_page');
    const renderContent = () => {
        if (isLoading) {
            return [...Array(10)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />);
        }

        if (error) {
            return (
                <Box sx={{ textAlign: 'center', color: 'error.main' }}>Error loading data. Please try again.</Box>
            );
        }

        if (tokensList.length === 0) {
            return <Box sx={{ textAlign: 'center' }}>No tokens found.</Box>;
        }

        const content = [];

        // Render ad row if ad data is available
        if (!isAdsLoading && adsData.length > 0) {
            content.push(<AdsSlider key="ads-row" adsData={adsData} handleItemClick={handleItemClick} />);
        }

        if (tokensList.length === 0) {
            content.push(<Box sx={{ textAlign: 'center' }}>No tokens found.</Box>);
        } else {
            content.push(
                tokensList.map((token) => (
                    <TokenRow
                        key={token.ticker}
                        token={token}
                        handleItemClick={handleItemClick}
                        walletConnected={walletConnected}
                        walletBalance={walletBalance}
                        walletAddress={walletAddress}
                    />
                )),
            );
        }

        return content;
    };

    return (
        <>
            <GlobalStyle />
            <GridHeadersComponent
                setChangeTotalMintsActive={setChangeTotalMintsActive}
                onSortBy={sortBy}
                setActiveHeader={setActiveHeader}
                activeHeader={activeHeader}
            />
            <List
                id="scrollableList"
                dense
                sx={{
                    width: '100%',
                    overflowX: 'hidden',
                    height: '70vh',
                }}
            >
                {renderContent()}
            </List>
        </>
    );
};

export default TokenDataGrid;
