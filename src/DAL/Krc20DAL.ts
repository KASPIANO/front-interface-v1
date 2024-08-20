import { Token, TokenListResponse } from '../types/Types';
import { KRC20InfoService } from './AxiosInstaces';

export const fetchReceivingBalance = async (address: string, tokenSymbol: string): Promise<number> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/address/${address}/token/${tokenSymbol}`);
        return response.data.balance / 1e8;
    } catch (error) {
        console.error('Error fetching receiving balance:', error);
        return 0;
    }
};

export async function fetchTransferHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        return [];
    }
}

export async function fetchTotalSupply(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${ticker}`);
        const { data } = response;
        if (data.result && data.result.length > 0) {
            return parseInt(data.result[0].max);
        }
        throw new Error('Total supply not found');
    } catch (error) {
        console.error('Error fetching total supply:', error);
        return 1;
    }
}

export async function fetchMintHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/mint?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching mint history:', error);
        return [];
    }
}

export const fetchTokens = async (next?: string): Promise<TokenListResponse> => {
    try {
        const nextString = next ? `?next=${next}` : '';
        const response = await KRC20InfoService.get<any>(`krc20/tokenlist${nextString}`);
        return response.data
            ? { result: response.data.result, next: response.data.next, prev: response.data.prev }
            : {
                  result: [],
                  next: '',
                  prev: '',
              };
    } catch (error) {
        console.error('Error fetching token list:', error);
        return {
            result: [],
            next: '',
            prev: '',
        };
    }
};

export const fetchTokenInfo = async (tick: string, holders = true): Promise<Token> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${tick}?holder=${holders}`);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {} as Token;
    }
};

export async function fetchHoldersCount(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${ticker}?holder=true`);
        return response.data.result.length;
    } catch (error) {
        console.error('Error fetching holders count:', error);
        return 0;
    }
}

export async function fetchTransactionCount(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}`);
        return response.data.result.length;
    } catch (error) {
        console.error('Error fetching transaction count:', error);
        return 0;
    }
}
export async function fetchTotalTokensDeployed(): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`info/`);
        return response.data.result.tokenTotal;
    } catch (error) {
        console.error('Error fetching token count:', error);
        return 0;
    }
}
export async function fetchDevWalletBalance(ticker: string, devWallet: string): Promise<any> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/address/${devWallet}/token/${ticker}`);
        return response.data.result[0].balance;
    } catch (error) {
        console.error('Error fetching token count:', error);
        return 0;
    }
}
// This iterates through the 50 items from the api and fecthes the token info for each token, in the data base the token details and al together in the ticker, no need for 2 requests
// the only thing is that you need to do pagination, 50 tokes per request, make it so that you can implement sort by relevant headers in the table, and also by the relevant time frame,
// theres a filter of time there also, look at the possible options in the grid
//    useEffect(() => {
//     const loadTokens = async () => {
//         try {
//             setLoading(true);
//             const offset = nextPage * 50;
//             const slicedTokensList = tokensList.slice(0, offset);
//             const detailedTokens = await Promise.all(
//                 slicedTokensList.map(async (token) => {
//                     const tokenDetails = await fetchTokenInfo(token.tick);
//                     return {
//                         ...token,
//                         ...tokenDetails[0],
//                     };
//                 }),
//             );
//             setTokensRows((prevTokenRows) => [...prevTokenRows, ...detailedTokens]);
//         } catch (error) {
//             console.error('Error loading tokens:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     loadTokens();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [tokensList]);
