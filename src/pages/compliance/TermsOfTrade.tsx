import React from 'react';
import { Container, Typography } from '@mui/material';

const TermsOfTrade: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
            Terms of Trade
        </Typography>
        <Typography variant="body1" paragraph>
            Last Updated: 12/09/2024
        </Typography>
        <Typography variant="body1" paragraph>
            Please read these Terms of Trade ("Terms") carefully, as they govern your interactions with our
            platform and its services. By proceeding with any transaction, you agree to these Terms.
        </Typography>

        <Typography variant="h6" gutterBottom>
            1. Trade Process and Wallet Management
        </Typography>
        <Typography variant="body1" paragraph>
            Old orders on our platform are managed by a third-party wallet that handles each transaction in
            distinct stages. While this ensures smooth processing under most conditions, it is more susceptible to
            delays due to external factors such as network congestion, spikes in gas fees, or transaction
            confirmation delays.
        </Typography>
        <Typography variant="body1" paragraph>
            To address these challenges and provide a better trading experience, we have introduced the new Partial
            Sign Kaspa Transaction (PSKT) protocol for modern orders. This protocol replaces the third-party wallet
            system with a trust-minimized and decentralized approach, offering greater security and flexibility.
        </Typography>

        <Typography variant="h6" gutterBottom>
            2. Tracking and Security of Transactions
        </Typography>
        <Typography variant="body1" paragraph>
            Every stage of your transaction is securely tracked and recorded within our system to ensure
            transparency and the safety of your assets. This applies to both old orders and PSKT-based
            transactions. For PSKT transactions, additional protections are in place to safeguard your assets
            during the signing process.
        </Typography>

        <Typography variant="h6" gutterBottom>
            3. Gas Fees and Refund Policy
        </Typography>
        <Typography variant="body1" paragraph>
            Each transaction requires its own gas fee. Due to the dynamic nature of gas prices, there may be
            situations where a transaction is temporarily halted if gas fees rise sharply during the process.
        </Typography>
        <Typography variant="body1" paragraph>
            For old orders managed by a third-party wallet, the system may automatically retry the transaction when
            conditions are favorable. For PSKT orders, users retain control over the signing process and can adjust
            parameters such as gas fees before finalizing the transaction.
        </Typography>
        <Typography variant="body1" paragraph>
            To mitigate issues, we charge a fixed network gas fee of 5 KAS per transaction. For PSKT orders, any
            unused portion of this fee is automatically refunded to your wallet after the trade is completed.
        </Typography>

        <Typography variant="h6" gutterBottom>
            4. User Responsibilities
        </Typography>
        <Typography variant="body1" paragraph>
            It is your responsibility to ensure that your wallet is properly funded to cover the gas fees for each
            transaction. For old orders, the platform will notify you if additional funds are required. For PSKT
            orders, you may need to actively participate in signing and finalizing the transaction.
        </Typography>

        <Typography variant="h6" gutterBottom>
            5. Partial Sign Kaspa Transaction (PSKT) Protocol
        </Typography>
        <Typography variant="body1" paragraph>
            The PSKT protocol introduces a modern approach to handling transactions, designed to overcome
            limitations of the old third-party wallet system. PSKT enables secure, efficient, and decentralized
            transactions between buyers and sellers by partially signing transactions at different stages.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>Key Concepts:</strong> PSKT allows buyers and sellers to interact without full trust in each
            other. The protocol ensures that: - Sellers can commit to a transaction without immediately finalizing
            it, retaining control over their assets. - Buyers can proceed with payment while ensuring the
            transaction is directed correctly to the seller. - The platform combines and verifies both parties’
            inputs, ensuring a seamless transaction experience.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>Benefits:</strong> The PSKT protocol provides: - Security: Ensures the safety of both parties’
            assets throughout the transaction process. - Flexibility: Allows adjustments or cancellations if
            conditions change before finalization. - Efficiency: Reduces the likelihood of failed transactions due
            to network conditions. - Trust Minimization: Both parties rely on the protocol rather than direct trust
            in each other.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>How It Works:</strong> The transaction starts with the seller partially signing it, allowing
            the buyer to review and complete their part. Once both sides have submitted their inputs, the platform
            combines them into a finalized transaction. The system then verifies the transaction, runs a network
            test, and broadcasts it to the Kaspa network, ensuring smooth and timely processing.
        </Typography>

        <Typography variant="h6" gutterBottom>
            6. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
            We are not liable for any external factors that may cause a delay in processing your transaction,
            including but not limited to network congestion, unforeseen increases in gas fees, or blockchain
            errors. While we do our utmost to ensure the smooth and timely execution of trades, certain elements
            are beyond our control.
        </Typography>

        <Typography variant="h6" gutterBottom>
            7. Contact Information
        </Typography>
        <Typography variant="body1" paragraph>
            If you have any questions or concerns regarding these Terms, please contact us at support@kaspiano.com.
        </Typography>
    </Container>
);

export default TermsOfTrade;
