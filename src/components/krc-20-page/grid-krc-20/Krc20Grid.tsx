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
    setChangeMCActive: (value: boolean) => void;
    setChangeTotalHoldersActive: (value: boolean) => void;
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
        setChangeMCActive,
        setChangeTotalHoldersActive,
    } = props;
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.ticker}`);
    };

    const handleItemClickAds = (link: string) => {
        // Check if the link starts with http:// or https://
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            // If not, assume it's a domain and prepend https://
            link = `https://${link}`;
        }

        // Open the link in a new tab
        window.open(link, '_blank');
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

        return tokensList.map((token) => (
            <TokenRow
                walletConnected={walletConnected}
                key={token.ticker}
                walletBalance={walletBalance}
                handleItemClick={handleItemClick}
                token={token}
                walletAddress={walletAddress}
            />
        ));
    };

    const renderAds = () => {
        if (isAdsLoading) {
            return <Skeleton key="ads-row" width={'100%'} height={'12vh'} />;
        }

        if (!adsData || adsData.length === 0) {
            return null;
        }

        return (
            <Box
                key="ads-row"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: 'background.paper', // Adjust as necessary for your theme
                }}
            >
                <AdsSlider
                    adsData={adsData}
                    handleItemClick={handleItemClickAds}
                    walletBalance={walletBalance}
                    walletConnected={walletConnected}
                />
            </Box>
        );
    };

    return (
        <>
            <GlobalStyle />
            <GridHeadersComponent
                setChangeTotalMintsActive={setChangeTotalMintsActive}
                setChangeMCActive={setChangeMCActive}
                setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                onSortBy={sortBy}
                setActiveHeader={setActiveHeader}
                activeHeader={activeHeader}
            />
            <List
                id="scrollableList"
                dense
                sx={{
                    paddingTop: 0,
                    width: '100%',
                    overflowX: 'hidden',
                    height: '70vh',
                }}
            >
                {renderAds()}
                {renderContent()}
            </List>
        </>
    );
};

export default TokenDataGrid;
