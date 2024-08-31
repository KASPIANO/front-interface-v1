import React from 'react';
import { Container, Typography } from '@mui/material';

const TermsOfService: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
            Terms of Service
        </Typography>
        <Typography variant="body1" paragraph>
            Last Updated: 08/30/2024
        </Typography>
        <Typography variant="body1" paragraph>
            Please read these Terms of Service ("Terms") carefully as they govern your use of the Kaspiano platform
            (located at kaspiano.com) and all related services ("Services"). By using our Services, you agree to
            these Terms.
        </Typography>
        <Typography variant="h6" gutterBottom>
            1. Agreement to Terms
        </Typography>
        <Typography variant="body1" paragraph>
            By using our Services, you agree to be bound by these Terms. If you do not agree, you are not
            authorized to use our Services.
        </Typography>
        <Typography variant="h6" gutterBottom>
            2. Changes to These Terms
        </Typography>
        <Typography variant="body1" paragraph>
            We may update the Terms from time to time. If we do, we’ll notify you by posting the updated Terms on
            our website. Continued use of our Services after changes means you accept the updated Terms.
        </Typography>
        <Typography variant="h6" gutterBottom>
            3. Who May Use the Services
        </Typography>
        <Typography variant="body1" paragraph>
            You must be 18 years or older to use our Services and comply with all applicable laws when using our
            Services.
        </Typography>
        <Typography variant="h6" gutterBottom>
            4. Use of the Services
        </Typography>
        <Typography variant="body1" paragraph>
            The Services provided by Kaspiano facilitate interaction with digital wallets and transactions
            involving digital assets. Kaspiano does not offer investment advice and is not responsible for any
            financial decisions made by users.
        </Typography>
        <Typography variant="h6" gutterBottom>
            5. Intellectual Property Rights
        </Typography>
        <Typography variant="body1" paragraph>
            Kaspiano owns all rights, title, and interest in and to the Services, including all associated
            intellectual property rights.
        </Typography>
        <Typography variant="h6" gutterBottom>
            6. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
            Kaspiano will not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of our Services.
        </Typography>
        <Typography variant="h6" gutterBottom>
            7. Dispute Resolution
        </Typography>
        <Typography variant="body1" paragraph>
            Any disputes arising from these Terms will be resolved through binding arbitration, and not in a court
            of law.
        </Typography>
        <Typography variant="h6" gutterBottom>
            8. Contact Information
        </Typography>
        <Typography variant="body1" paragraph>
            For any questions or concerns about these Terms, please contact us at support@kaspiano.com.
        </Typography>
    </Container>
);

export default TermsOfService;
