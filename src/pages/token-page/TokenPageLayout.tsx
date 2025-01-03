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
                xs={8.5}
                sm={8.5}
                md={8.5}
                lg={8.5}
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

                <Grid container item xs={12} sm={12} md={12} lg={12} spacing={0.5}>
                    <Grid item xs={8} sm={8} md={8} lg={8}>
                        {children[2]}
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        {children[3]}
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={12} md={12} lg={12} spacing={0.5}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        {children[4]}
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        {children[5]}
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={3.5}
                sm={3.5}
                md={3.5}
                lg={3.5}
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 0,
                    },
                }}
            >
                {children[6]}
            </Grid>
        </Grid>
    </div>
);
