import { Box, Grid, Typography, Avatar, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

// Partner data with specific details
const partners = [
    {
        name: 'Kaspa Foundation',
        description:
            'The Kaspa Foundation plays a key role in supporting decentralized and scalable blockchain solutions, providing crucial infrastructure for Kaspiano.',
        logo: 'https://krc20data.s3.amazonaws.com/verified/kaspa_foundation.png',
        linkedIn: 'https://www.linkedin.com/company/kaspa/',
        twitter: 'https://x.com/kaspa',
    },
    {
        name: 'CryptoLink',
        description:
            'CryptoLink collaborates with Kaspiano to enhance blockchain accessibility and promote decentralized finance solutions worldwide.',
        logo: 'https://krc20data.s3.amazonaws.com/verified/cryptolink.png',
        twitter: 'https://x.com/cryptolink_official',
    },
];

const PartnersPage = () => (
    <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Our Partners
        </Typography>
        <Grid container spacing={4}>
            {partners.map((partner, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '1rem',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                        }}
                    >
                        {/* Partner Logo */}
                        <Avatar
                            src={partner.logo}
                            alt={partner.name}
                            sx={{ width: '100px', height: '100px', marginBottom: '1rem' }}
                        />

                        {/* Partner Name & Description */}
                        <Typography variant="h6" gutterBottom>
                            {partner.name}
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: '1rem' }}>
                            {partner.description}
                        </Typography>

                        {/* Social Media Links */}
                        <Box>
                            {partner.twitter && (
                                <IconButton
                                    aria-label="Twitter"
                                    component="a"
                                    href={partner.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#1DA1F2' }}
                                >
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {partner.linkedIn && (
                                <IconButton
                                    aria-label="LinkedIn"
                                    component="a"
                                    href={partner.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#0077B5' }}
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
);

export default PartnersPage;
