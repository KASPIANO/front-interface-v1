import React from 'react';
import { Container, Typography } from '@mui/material';

const TermsOfTrade: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
            Terms of Trade
        </Typography>
        <Typography variant="body1" paragraph>
            Last Updated: 09/30/2024
        </Typography>
        <Typography variant="body1" paragraph>
            Please read these Terms of Trade ("Terms") carefully, as they govern your interactions with our
            platform and its services. By proceeding with any transaction, you agree to these Terms.
        </Typography>

        <Typography variant="h6" gutterBottom>
            1. Trade Process and Wallet Management
        </Typography>
        <Typography variant="body1" paragraph>
            All transactions conducted on our platform are managed by a third-party wallet under our secure
            management. This wallet handles each trade in distinct stages to ensure smooth processing. In the event
            that one of these stages encounters an issue—such as a spike in gas fees or a delay in transaction
            confirmation—the trade will not go through immediately.
        </Typography>
        <Typography variant="body1" paragraph>
            However, we have implemented an automated system designed to monitor and resolve any stalled
            transactions. Once the external conditions (e.g., gas fees) become more favorable, the system will
            resume and complete the transaction. This ensures that no trade is left incomplete due to temporary
            technical issues.
        </Typography>

        <Typography variant="h6" gutterBottom>
            2. Tracking and Security of Transactions
        </Typography>
        <Typography variant="body1" paragraph>
            Every stage of your transaction is securely tracked and recorded within our system to ensure
            transparency and the safety of your assets. We store all relevant trade data, allowing us to monitor
            the process and safeguard your funds and tokens throughout the transaction lifecycle.
        </Typography>

        <Typography variant="h6" gutterBottom>
            3. Gas Fees and Refund Policy
        </Typography>
        <Typography variant="body1" paragraph>
            Each transaction requires its own gas fee. Due to the dynamic nature of gas prices, there may be
            situations where a transaction is temporarily halted if gas fees rise sharply during the process.
        </Typography>
        <Typography variant="body1" paragraph>
            To mitigate this, we charge a fixed network gas fee of 5 KAS per transaction. This fee acts as an upper
            bound and safety net to cover potential increases in gas prices. Typically, only a small portion of
            this fee (approximately 0.01 KAS) is used for the actual transaction, and the remainder will be
            automatically refunded to your wallet after the trade is completed.
        </Typography>

        <Typography variant="h6" gutterBottom>
            4. User Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
            It is your responsibility to ensure that your wallet is properly funded to cover the gas fees for each
            transaction. Our system will notify you in case additional actions are needed, such as adding funds or
            adjusting your transaction settings.
        </Typography>

        <Typography variant="h6" gutterBottom>
            5. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
            We are not liable for any external factors that may cause a delay in processing your transaction,
            including but not limited to network congestion, unforeseen increases in gas fees, or blockchain
            errors. While we do our utmost to ensure the smooth and timely execution of trades, certain elements
            are beyond our control.
        </Typography>

        <Typography variant="h6" gutterBottom>
            6. Contact Information
        </Typography>
        <Typography variant="body1" paragraph>
            If you have any questions or concerns regarding these Terms, please contact us at support@kaspiano.com.
        </Typography>
    </Container>
);

export default TermsOfTrade;
