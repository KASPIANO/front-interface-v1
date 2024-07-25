import { FC, useEffect, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import NotificationComponent from '../../components/notification/Notification';
import { fetchTokens, fetchTotalTokensDeployed } from '../../DAL/Krc20DAL';
import { TokenResponse } from '../../types/Types';
import { GridLayout } from './GridPageLayout';

interface GridPageProps {
    walletAddress: string | null;
    connectWallet?: () => void;
    walletBalance: number;
    walletConnected: boolean;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    setWalletAddress: (value: string | null) => void;
    setWalletBalance: (value: number) => void;
}

// const tokens = [
//     { name: 'Kaspa', symbol: 'KAS', logoURI: '/kaspa.svg' },
//     { name: 'TokenA', symbol: 'TKA', logoURI: '/tokenA.svg' },
// ];

const GridPage: FC<GridPageProps> = (props) => {
    const {
        walletAddress,
        connectWallet,
        walletBalance,
        showNotification,
        setShowNotification,
        setWalletAddress,
        setWalletBalance,
    } = props;

    const [tokensList, setTokensList] = useState<TokenResponse[]>([]);
    const [nextPage, setNextPage] = useState<number>(1);
    const [nextPageParams, setNextPageParams] = useState<string>('');
    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);

    useEffect(() => {
        fetchTotalTokensDeployed().then((result) => {
            setTotalTokensDeployed(result);
        });
    }, []);

    useEffect(() => {
        const fetchTokensList = async () => {
            const tokensList = await fetchTokens(nextPageParams);
            setTokensList((prevTokensList) => [...prevTokensList, ...tokensList.result]);
            setNextPageParams(tokensList.next);
        };

        fetchTokensList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextPage]);

    return (
        <GridLayout>
            <GridTitle />
            <TokenDataGrid
                nextPage={nextPage}
                totalTokensDeployed={totalTokensDeployed}
                tokensList={tokensList}
                setNextPage={setNextPage}
                nextPageParams={nextPageParams}
            />

            {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )}
            {/* {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />} */}
        </GridLayout>
    );
};

export default GridPage;

// const openSlippageModal = () => {
//     setIsModalOpen(true);
//     setIsBlurred(true);
// };

// const closeSlippageModal = () => {
//     setIsModalOpen(false);
//     setIsBlurred(false);
// };

// const openTokenModal = (isPaying: boolean) => {
//     setIsPayingTokenModal(isPaying);
//     setIsTokenModalOpen(true);
//     setIsBlurred(true);
// };

// const closeTokenModal = () => {
//     setIsTokenModalOpen(false);
//     setIsBlurred(false);
// };

// const handleTokenSelect = (token: Token) => {
//     if (isPayingTokenModal) {
//         setPayingCurrency(token.symbol);
//         setPayingCurrencyImage(token.logo);
//     } else {
//         setReceivingCurrency(token.symbol);
//         setReceivingCurrencyImage(token.logo);
//     }
//     closeTokenModal();
// };

// const handleSlippageSave = (mode: string, value: string) => {
//     setSlippageMode(mode);
//     setSlippageValue(value);
// };
