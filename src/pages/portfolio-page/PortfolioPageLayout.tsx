import { Grid } from '@mui/material';

export const PortfolioLayout = ({ children, backgroundBlur }) => (
    <div
        style={{
            display: 'flex',
            filter: backgroundBlur ? 'blur(6px)' : 'none',
            transition: 'backdrop-filter 0.3s ease',
        }}
    >
        <Grid container spacing={1} padding={2.5} maxWidth={'97%'}>
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 2,
                    },
                }}
            >
                {children[0]}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
                {children[1]}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
                {children[3]}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
                {children[4]}
            </Grid>
        </Grid>

        {children[5]}
        {children[6]}
        {children[7]}
        {children[8]}
    </div>
);
