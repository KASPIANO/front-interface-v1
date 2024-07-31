import { FC, useEffect, useState } from "react";
import { Token } from "../../../../types/Types";
import { Box, Skeleton, Typography } from "@mui/material";
import { DataPaper, DataRowContainer } from "./TokenSideBarInfo.s";

interface TokenSideBarInfoProps {
    tokenInfo: Token;
    priceInfo: any;
}


const TokenSideBarInfo: FC<TokenSideBarInfoProps> = (props) => {
    return (
        <Box>
            <DataRowContainer gap={1}>
                <DataPaper elevation={0}>
                    <Typography variant="body2" align="center" color="text.secondary">PRICE USD</Typography>
                    <Typography variant="body2" align="center">---</Typography>
                </DataPaper>
                <DataPaper elevation={0}>
                    <Typography variant="body2" align="center" color="text.secondary">PRICE</Typography>
                    <Typography variant="body2" align="center">---</Typography>
                </DataPaper>
            </DataRowContainer>
            <DataRowContainer mt={1} gap={1}>
                <DataPaper elevation={0}>
                    <Typography variant="body2" align="center" color="text.secondary">LIQUIDITY</Typography>
                    <Typography variant="body2" align="center">---</Typography>
                </DataPaper>
                <DataPaper elevation={0}>
                    <Typography variant="body2" align="center" color="text.secondary">FDV</Typography>
                    <Typography variant="body2" align="center">---</Typography>
                </DataPaper>
                <DataPaper elevation={0}>
                    <Typography variant="body2" align="center" color="text.secondary">MKT CAP</Typography>
                    <Typography variant="body2" align="center">---</Typography>
                </DataPaper>
            </DataRowContainer>
        </Box>
    );
}

export default TokenSideBarInfo;