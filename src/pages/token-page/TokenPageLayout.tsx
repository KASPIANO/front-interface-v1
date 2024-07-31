import { Grid } from '@mui/material';

export const TokenPageLayout = ({ children }) => (
    <div style={{ display: 'flex' }}>
        <Grid container spacing={1} padding={2}>
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

            <Grid item container spacing={1} rowSpacing={1} xs={8} sm={8} md={8} lg={8}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[1]}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[2]}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[3]}
                </Grid>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
                {children[4]}
            </Grid>
        </Grid>
    </div>
);
