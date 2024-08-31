import React from 'react';
import { Container, Typography } from '@mui/material';

const TrustSafety: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
            Trust and Safety
        </Typography>
        <Typography variant="body1" paragraph>
            At Kaspiano, we are committed to providing a safe and trusted environment for all users of our
            platform. This Trust and Safety policy outlines the measures we take to protect our users and maintain
            the integrity of our Services.
        </Typography>
        {/* Repeat for each section and subsection */}
        <Typography variant="h6" gutterBottom>
            1. User Security
        </Typography>
        <Typography variant="body1" paragraph>
            We implement industry-standard security protocols to protect user data and transactions on our
            platform. Users are encouraged to use strong passwords and enable two-factor authentication for
            additional security.
        </Typography>
        {/* Continue adding sections as needed */}
    </Container>
);

export default TrustSafety;
