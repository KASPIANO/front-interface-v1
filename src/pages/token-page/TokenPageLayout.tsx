import { Grid } from '@mui/material';

export const TokenPageLayout = ({ children, backgroundBlur }) => (
    <div
        style={{
            display: 'flex',
            filter: backgroundBlur ? 'blur(6px)' : 'none',
            transition: 'backdrop-filter 0.3s ease',
        }}
    >
        <Grid container spacing={1} padding={2}>
            <Grid
                item
                container
                rowSpacing={1}
                xs={9}
                sm={9}
                md={9}
                lg={9}
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 0,
                    },
                }}
            >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[0]}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[1]}
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {children[2]}
                </Grid>
                <Grid container item xs={12} sm={12} md={12} lg={12} spacing={0.5}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        {children[3]}
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        {children[4]}
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={3}
                sm={3}
                md={3}
                lg={3}
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 0,
                    },
                }}
            >
                {children[5]}
            </Grid>
        </Grid>
    </div>
);
