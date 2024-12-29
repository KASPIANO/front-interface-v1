import { Skeleton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { showGlobalSnackbar } from "../../components/alert-context/AlertContext";
import MintingComponent from "../../components/token-page/minting-status/MintingStatus";
import RugScore from "../../components/token-page/rug-score/RugScore";
import TokenGraph from "../../components/token-page/token-graph/TokenGraph";
import TokenHeader from "../../components/token-page/token-header/TokenHeader";
import TokenSideBar from "../../components/token-page/token-sidebar/TokenSideBar";
import TokenStats from "../../components/token-page/token-stats/TokenStats";
import TopHolders from "../../components/token-page/top-holders/TopHolders";
import {
  fetchTokenByTicker,
  getTokenPriceHistory,
  recalculateRugScore,
} from "../../DAL/BackendDAL";
import { createSellOrderV2 } from "../../DAL/BackendP2PDAL";
import { kaspaLivePrice } from "../../DAL/KaspaApiDal";
import { BackendTokenResponse } from "../../types/Types";
import { TokenPageLayout } from "./TokenPageLayout";

interface TokenPageProps {
  walletAddress: string | null;
  connectWallet?: () => void;
  network: string;
  backgroundBlur: boolean;
  walletBalance: number;
  walletConnected: boolean;
}
const tradingDataTimeFramesToSelect = ["All", "30d", "7d", "1d", "6h", "1h"];
const POLLING_INTERVAL = 15000; // 5 seconds
const STORAGE_KEY = "pendingPSKT";

const TokenPage: FC<TokenPageProps> = (props) => {
  const { walletConnected, walletBalance, walletAddress, backgroundBlur } =
    props;
  const { ticker } = useParams();
  const [tokenInfo, setTokenInfo] = useState<BackendTokenResponse>(null);
  const [tokenXHandle, setTokenXHandle] = useState(false);
  const [recalculateRugScoreLoading, setRecalculateRugScoreLoading] =
    useState(false);
  const [kasPrice, setkasPrice] = useState(0);
  const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(
    tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 4]
  );
  const queryClient = useQueryClient();
  let pollingInterval;

  const removeTransaction = (txId) => {
    const pendingTransactions = getStoredTransactions();
    const updatedTransactions = pendingTransactions.filter(
      (tx) => tx.sendCommitTxId !== txId
    );
    saveTransactionsToStorage(updatedTransactions);

    if (updatedTransactions.length === 0) {
      stopPolling();
    }
  };

  const getStoredTransactions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };

  const saveTransactionsToStorage = (transactions) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Helper function to clean up polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  };

  const pollPendingTransactions = async () => {
    const pendingTransactions = getStoredTransactions();

    if (pendingTransactions.length === 0) {
      stopPolling();
      return;
    }

    for (const tx of pendingTransactions) {
      try {
        // Attempt to create sell order
        await createSellOrderV2(
          tx.ticker,
          tx.amount,
          tx.totalPrice,
          tx.pricePerToken,
          tx.txJsonString
        );

        // On success
        removeTransaction(tx.sendCommitTxId);
        showGlobalSnackbar({
          message: "Recovered transaction: Sell order created successfully",
          severity: "success",
          commitId: tx.sendCommitTxId,
        });
      } catch (error) {
        const updatedTx = {
          ...tx,
          retryCount: (tx.retryCount || 0) + 1,
        };

        const transactions = getStoredTransactions();
        const updatedTransactions = transactions.map((t) =>
          t.sendCommitTxId === tx.sendCommitTxId ? updatedTx : t
        );
        saveTransactionsToStorage(updatedTransactions);
      }
    }
  };

  const startPolling = () => {
    pollingInterval = setInterval(pollPendingTransactions, POLLING_INTERVAL);
    return pollingInterval;
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const newPrice = await kaspaLivePrice();
      setkasPrice(newPrice);
    };

    // Fetch the price immediately when the component mounts
    fetchPrice();

    // Set up the interval to fetch the price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const fetchAndUpdateTokenInfo = useCallback(
    async (refresh?: boolean) => {
      try {
        const updatedTokenData = await fetchTokenByTicker(
          ticker,
          walletAddress,
          refresh
        );
        setTokenInfo(updatedTokenData);
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    },
    [ticker, walletAddress]
  );

  useEffect(() => {
    if (tokenInfo) {
      setTokenXHandle(!!tokenInfo?.metadata.socials?.x);
    }
  }, [tokenInfo]);

  useEffect(() => {
    // Fetch the token info immediately on component mount
    fetchAndUpdateTokenInfo(false);

    // Set up the interval to update token info every 5 minutes
    const interval = setInterval(() => fetchAndUpdateTokenInfo(true), 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker, walletAddress]);

  const { data: priceHistoryData, isLoading } = useQuery({
    queryKey: ["tokenPriceHistory", ticker, tradingDataTimeFrame], // The query key
    queryFn: async () => {
      const result = await getTokenPriceHistory(ticker, tradingDataTimeFrame);
      return result;
    },
    enabled: !!ticker, // Only fetch if the ticker exists
    staleTime: Infinity, // The cache never expires
    refetchInterval: 900000, // 15 minutes
  });

  const tokenData = useMemo(() => tokenInfo, [tokenInfo]);

  const getComponentToShow = (
    component: JSX.Element,
    height?: string,
    width?: string
  ) =>
    tokenData ? (
      component
    ) : (
      <Skeleton variant="rectangular" height={height} width={width} />
    );

  const getComponentGraphToShow = (
    component: JSX.Element,
    height?: string,
    width?: string
  ) =>
    !isLoading && priceHistoryData.length > 0 ? (
      component
    ) : (
      <Skeleton variant="rectangular" height={height} width={width} />
    );

  const rugScoreParse =
    tokenInfo?.metadata?.rugScore === 0 ? null : tokenInfo?.metadata?.rugScore;

  const recalculateRugScoreAndShow = async () => {
    setRecalculateRugScoreLoading(true);

    try {
      const result = await recalculateRugScore(tokenInfo.ticker);

      if (result) {
        setTokenInfo({
          ...tokenInfo,
          metadata: { ...tokenInfo.metadata, rugScore: result },
        });
      }
    } catch (error) {
      console.error("Error recalculating rug score:", error);

      if (error instanceof AxiosError && error.response?.status === 400) {
        showGlobalSnackbar({
          message: "Please wait 3 hours before recalculation of the rug score",
          severity: "error",
        });
      } else {
        showGlobalSnackbar({
          message: "Error recalculating rug score, Please try again later",
          severity: "error",
        });
      }
    } finally {
      setRecalculateRugScoreLoading(false);
    }
  };
  return (
    <TokenPageLayout backgroundBlur={backgroundBlur}>
      {getComponentToShow(<TokenHeader tokenInfo={tokenInfo} />, "11.5vh")}
      {getComponentGraphToShow(
        <TokenGraph
          key={tradingDataTimeFrame}
          priceHistory={priceHistoryData}
          ticker={tokenInfo?.ticker}
          timeframe={tradingDataTimeFrame}
        />,
        "35vh"
      )}
      {getComponentToShow(
        <TokenStats
          tokenInfo={tokenInfo}
          setTradingDataTimeFrame={setTradingDataTimeFrame}
          tradingDataTimeFrame={tradingDataTimeFrame}
          tradingDataTimeFramesToSelect={tradingDataTimeFramesToSelect}
        />
      )}
      {getComponentToShow(
        <MintingComponent
          tokenInfo={tokenInfo}
          walletBalance={walletBalance}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          setTokenInfo={setTokenInfo}
        />
      )}
      {getComponentToShow(
        <RugScore
          walletConnected={walletConnected}
          ticker={ticker}
          walletBalance={walletBalance}
          score={rugScoreParse}
          onRecalculate={recalculateRugScoreAndShow}
          xHandle={tokenXHandle}
          walletAddress={walletAddress}
          setTokenInfo={setTokenInfo}
          isLoadingRugScore={recalculateRugScoreLoading}
        />,
        "19vh"
      )}
      {getComponentToShow(<TopHolders tokenInfo={tokenInfo} />, "19vh")}
      {/* {getComponentToShow(<TokenHolders tokenInfo={tokenInfo} />)} */}
      {getComponentToShow(
        <TokenSideBar
          startPolling={startPolling}
          kasPrice={kasPrice}
          tokenInfo={tokenInfo}
          setTokenInfo={setTokenInfo}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          walletBalance={walletBalance}
        />,
        "91vh"
      )}

      {/* {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )} */}
      {/* {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />} */}
    </TokenPageLayout>
  );
};

export default TokenPage;
