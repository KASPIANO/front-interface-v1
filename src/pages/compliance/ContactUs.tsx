import React from 'react';
import { Box, Typography, Link, Card, CardContent, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

const ContactUs: React.FC = () => (
    <Box
        sx={{
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                Welcome to Kaspiano!
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '730px' }}>
                We're excited to have you as part of our community. Join us on our social channels and be a part of
                the conversation. If you need help or have any listings-related inquiries, feel free to reach out!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '2vh' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Join our community:
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <IconButton aria-label="Twitter" href="https://x.com/KaspianoApp" target="_blank">
                        <TwitterIcon fontSize="large" />
                    </IconButton>
                    <IconButton aria-label="Telegram" href="https://t.me/KaspianoApp" target="_blank">
                        <TelegramIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>
        </Box>

        <Box
            sx={{
                width: '60%',
                maxWidth: '900px',
            }}
        >
            {/* Contact Information */}
            <Card sx={{ flexGrow: 1, padding: '1rem' }}>
                <CardContent>
                    <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                        If you have any support-related inquiries, feel free to reach out to us at:
                    </Typography>

                    <Link href="mailto:support@kaspiano.com" underline="hover">
                        support@kaspiano.com
                    </Link>

                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
                        Please note: This email is strictly for support-related queries.
                    </Typography>

                    <Typography variant="body1" sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
                        For any listings-related questions or inquiries, please contact us at:
                    </Typography>

                    <Link href="mailto:listings@kaspiano.com" underline="hover">
                        listings@kaspiano.com
                    </Link>

                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
                        Please use this email for anything related to token listings and related services.
                    </Typography>
                </CardContent>
            </Card>

            {/* Social Media Icons */}
        </Box>
    </Box>
);

export default ContactUs;
