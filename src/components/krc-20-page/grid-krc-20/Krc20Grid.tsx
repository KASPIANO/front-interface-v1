import { GridPaginationModel } from '@mui/x-data-grid';
import { columns } from './Krc20Grid.config';
import { useEffect, useState } from 'react';
import { StyledDataGrid, StyledDataGridContainer } from './Krc20Grid.s';
import { fetchTokenInfo, fetchTokens } from '../../../DAL/Krc20DAL';
import { TokenResponse } from '../../../types/Types';

interface TokenDataGridProps {
    tokens: TokenResponse[];
}

const TokenDataGrid = (props) => {
    const { tokens } = props;
    const [tokensRows, setTokensRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 50,
        page: 0,
    });

    useEffect(() => {
        const loadTokens = async () => {
            try {
                setLoading(true);

                const detailedTokens = await Promise.all(
                    tokens.map(async (token) => {
                        const tokenDetails = await fetchTokenInfo(token.tick);
                        return {
                            ...token,
                            ...tokenDetails[0],
                        };
                    }),
                );
                setTokensRows(detailedTokens);
            } catch (error) {
                console.error('Error loading tokens:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTokens();
    }, [paginationModel.page]);

    const handlePaginationChange = (newPaginationModel: GridPaginationModel) => {
        setPaginationModel((prev) => ({
            ...prev,
            pageSize: 50,
            page: newPaginationModel.page,
        }));
    };

    return (
        <StyledDataGridContainer>
            <StyledDataGrid
                getRowId={(row) => row.tick}
                rows={tokensRows}
                columns={columns}
                loading={loading}
                pagination
                pageSizeOptions={[50, 100, 200]}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
            />
        </StyledDataGridContainer>
    );
};

export default TokenDataGrid;
