import { Grid } from '@mui/material';

export const DeployPageLayout = ({ children }) => (
    <div style={{ display: 'flex' }}>
        <Grid container spacing={1} padding={2} maxWidth={'85%'}>
            <Grid item xs={10} sm={10} md={10} lg={10}>
                {children[0]}
            </Grid>
        </Grid>
        {children[1]}
        {children[2]}
        {children[3]}
        {children[4]}
    </div>
);
