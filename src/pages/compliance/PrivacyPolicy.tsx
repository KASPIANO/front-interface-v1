import React from 'react';
import { Container, Typography } from '@mui/material';

const PrivacyPolicy: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
            Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
            Last Updated: 08/30/2024
        </Typography>
        <Typography variant="body1" paragraph>
            Kaspiano ("we," "our," or "us") provides services that allow users to interact with cryptocurrency
            wallets, explore different digital assets, and engage in transactions on the Kaspiano platform located
            at kaspiano.com. This Privacy Policy is designed to help you understand how we collect, use, process,
            and share your personal information, and to help you understand and exercise your privacy rights.
        </Typography>
        <Typography variant="h6" gutterBottom>
            1. Scope
        </Typography>
        <Typography variant="body1" paragraph>
            This Privacy Policy applies to personal information processed by us in connection with our website and
            other online or offline offerings. For information on how to contact us, please refer to the "Contact
            Us" section below.
        </Typography>
        <Typography variant="h6" gutterBottom>
            2. Personal Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
            We collect information you provide directly, such as your email address and cryptocurrency wallet
            information, as well as information collected automatically like transaction data. We do not collect
            information such as IP addresses, browser types, or specific pages visited.
        </Typography>
        <Typography variant="h6" gutterBottom>
            3. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
            We use your information to manage your account, provide our Services, communicate with you, offer
            customer support, and improve our Services.
        </Typography>
        <Typography variant="h6" gutterBottom>
            4. How We Share Your Information
        </Typography>
        <Typography variant="body1" paragraph>
            We may share your information with service providers, for legal compliance, or as necessary to provide
            our Services.
        </Typography>
        <Typography variant="h6" gutterBottom>
            5. Your Privacy Choices and Rights
        </Typography>
        <Typography variant="body1" paragraph>
            You can request access to or deletion of your personal information by contacting us at
            support@kaspiano.com.
        </Typography>
        <Typography variant="h6" gutterBottom>
            6. Security of Your Information
        </Typography>
        <Typography variant="body1" paragraph>
            We implement security measures to protect your information but cannot guarantee 100% security.
        </Typography>
        <Typography variant="h6" gutterBottom>
            7. Retention of Personal Information
        </Typography>
        <Typography variant="body1" paragraph>
            We retain your personal information as long as necessary to provide our Services or as required by law.
        </Typography>
        <Typography variant="h6" gutterBottom>
            8. Children's Information
        </Typography>
        <Typography variant="body1" paragraph>
            Our Services are not directed to children under 18, and we do not knowingly collect personal
            information from children.
        </Typography>
        <Typography variant="h6" gutterBottom>
            9. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
            If you have any questions about our privacy practices or this Privacy Policy, please contact us at
            support@kaspiano.com.
        </Typography>
    </Container>
);

export default PrivacyPolicy;
