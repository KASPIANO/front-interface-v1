import { Grid } from '@mui/material';

export const TokenPageLayout = ({ children }) => (
    <div style={{ display: 'flex' }}>
        <Grid container padding={2}>
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 0,
                    },
                }}
            >
                {children[0]}
            </Grid>

            <Grid container spacing={1} pt={2}>
                <Grid item xs={12} md={8}>
                    {children[2]}
                    {children[3]}
                    {children[4]}
                </Grid>
                <Grid item xs={12} md={4}>
                    {children[1]}
                </Grid>

            </Grid>
        </Grid>

    </div>
);
