import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';

export const formatDate = (timestamp: string): string => moment(Number(timestamp)).format('DD/MM/YYYY');

export const capitalizeFirstLetter = (string: string): string => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const columns: GridColDef[] = [
    { field: 'tick', headerName: 'Ticker', width: 100 },
    {
        field: 'mtsAdd',
        headerName: 'Date of Deployment',
        width: 100,
        valueGetter: (value, row) => formatDate(row.mtsAdd),
    },
    {
        field: 'percentageMinted',
        headerName: '% Minted',
        width: 100,
        valueGetter: (value, row) => `${((row.minted / row.max) * 100).toFixed(2)}%`,
        // valueGetter: (params) => `${((params.row.minted / params.row.max) * 100).toFixed(2)}%`,
    },
    {
        field: 'holders',
        headerName: 'Holders',
        width: 100,
        // valueGetter: (value, row) => row.holders.toLocaleString(),
    },
    {
        field: 'pre',
        headerName: 'Pre-Minted%',
        width: 100,
        valueGetter: (value, row) => `${((row.pre / row.max) * 100).toFixed(2)}%`,
    },
    {
        field: 'max',
        headerName: 'Supply',
        width: 200,
        // valueGetter: (value, row) => row.max.toLocaleString(),
    },
    {
        field: 'state',
        headerName: 'State',
        width: 100,
        valueGetter: (value, row) => capitalizeFirstLetter(row.state),
    },
    {
        field: 'age',
        headerName: 'Age',
        width: 100,
        valueGetter: (value, row) => `${moment().diff(Number(row.mtsAdd), 'days')} days`,
    },
    // { field: 'price', headerName: 'Price', width: 150, valueGetter: (params) => (0).toFixed(2) }, // Assuming static price as 0.00
    // { field: 'volume', headerName: 'Volume', width: 150, valueGetter: (params) => 0 }, // Assuming static volume as 0
    {
        field: 'actions',
        headerName: '',
        width: 200,
        renderCell: (params) => (
            <div>
                {params.row.minted < params.row.max && (
                    <Button variant="contained" color="primary" style={{ marginRight: '1vw' }}>
                        Mint
                    </Button>
                )}
                <Button variant="contained" color="secondary">
                    Trade
                </Button>
            </div>
        ),
    },
];
