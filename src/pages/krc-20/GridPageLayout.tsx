import { Grid } from '@mui/material';

export const GridLayout = ({ children }) => (
    <div style={{ display: 'flex' }}>
        <Grid container spacing={1} padding={2} maxWidth={'97%'}>
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

            <Grid item xs={12} sm={12} md={12} lg={12}>
                {children[1]}
            </Grid>
            <Grid
                sx={{
                    '&.MuiGrid-item': {
                        paddingTop: 0,
                    },
                }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
            >
                {children[2]}
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
