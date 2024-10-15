import React from 'react';
import { Container, Typography } from '@mui/material';

const FAQ: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Frequently Asked Questions
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Trade Process
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How is my transaction processed on Kaspiano?</strong>
            <br />
            When you initiate a trade, mint, or transfer on Kaspiano, the transaction is processed through the
            Kaspa blockchain. The network validates the transaction to ensure accuracy and security. Once
            confirmed, assets are transferred to the designated wallet.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. What happens if I don’t receive my tokens after a trade?</strong>
            <br />
            First, check the transaction status using the transaction hash (TXID). If confirmed but you haven't
            received your tokens, visit your portfolio and check your order history. Provide the order ID to
            support through Telegram or the website.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. What if my payment doesn’t go through, or I don’t receive my funds?</strong>
            <br />
            Ensure your wallet has enough balance for the transaction. Double-check the process, and if the issue
            persists, visit your portfolio, find the relevant order, and provide the order ID to support for
            further investigation.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Trading & Platform Rules
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. Are there limits on how many tokens I can mint or trade?</strong>
            <br />
            Currently, there are no limits on the number of tokens you can mint or trade, as long as you have
            sufficient funds to cover transaction fees.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. Why do we request 5 KAS for transaction fees?</strong>
            <br />
            The 5 KAS fee serves as a buffer in case gas fees spike during the transaction. Most transactions use
            only a portion of the 5 KAS, and you will typically receive back the unused amount.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. What are the platform’s trading rules?</strong>
            <br />
            All trades must follow the platform’s security protocols and fee structures. Ensure tokens comply with
            Kaspa’s standards to avoid restrictions.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>4. Are there any restricted tokens on Kaspiano?</strong>
            <br />
            Tokens flagged for security reasons, such as those with a low "Rug Score," may be restricted or
            delisted from the platform.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Security & Reliability
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. What should I do if I suspect fraudulent activity on my account?</strong>
            <br />
            Change your wallet credentials and contact Kaspiano support immediately through the website or
            Telegram. We will investigate to safeguard your assets and account.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How are my funds protected on Kaspiano?</strong>
            <br />
            All transactions are secured using blockchain technology, and issues are reviewed and resolved
            automatically when possible. Kaspiano’s Rug Score system helps assess token legitimacy.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            User Verification
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How does Kaspiano verify users?</strong>
            <br />
            Users connect their wallet and sign a message, allowing us to verify ownership and enhance transaction
            security.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. What does it mean to sign a message?</strong>
            <br />
            Signing a message proves wallet ownership without revealing the private key, used for authentication or
            verification purposes on decentralized platforms like Kaspiano.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Resources & Programs
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. What wallet is supported on Kaspiano?</strong>
            <br />
            Currently, only the Kasware Chrome extension wallet is supported for transactions on Kaspiano.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. What tools or programs does Kaspiano use for security and verification?</strong>
            <br />
            Kaspiano uses message signing, blockchain validation, and the Rug Score system to evaluate token
            safety.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. Does Kaspiano use any third-party services for analytics?</strong>
            <br />
            Yes, Kaspiano integrates blockchain explorers and data aggregators to provide real-time analytics on
            token prices, volumes, and trends.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>4. How does Kaspiano ensure reliable portfolio management?</strong>
            <br />
            Kaspiano’s Portfolio Dashboard tracks live blockchain data, allowing you to monitor your token holdings
            and manage them in real-time.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>5. What programs or technologies are used for token minting?</strong>
            <br />
            Token minting is fully integrated with the Kaspa blockchain, ensuring security and adherence to
            blockchain protocols.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. What is Kaspiano?</strong>
            <br />
            Kaspiano is a platform for managing, minting, and trading KRC-20 tokens on the Kaspa blockchain,
            offering advanced tools for portfolio management and token security.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How do I get started with Kaspiano?</strong>
            <br />
            Visit Kaspiano.com, connect your wallet (Kasware Chrome extension), and explore the features available
            for minting tokens, managing portfolios, and trading.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. How does Kaspiano work?</strong>
            <br />
            Kaspiano enables users to mint, manage, and trade KRC-20 tokens with tools for real-time data,
            portfolio tracking, batch transfers, and token safety features.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Fees
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. Are there trading fees?</strong>
            <br />
            Kaspiano offers the lowest trading fees in the market—just 2.5%! Even better, 20% of that fee (0.5%
            from the total) goes directly back to the communities and users through our referral program.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. What other fees should I be aware of?</strong>
            <br />A 500 KAS fee applies to batch airdrops, and additional fees may apply for premium services like
            token listings.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Features
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How do I mint tokens on Kaspiano?</strong>
            <br />
            Connect your wallet, go to the KRC-20 token dashboard, and select the Mint option to create new tokens.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How do I create a sell order?</strong>
            <br />
            After minting, go to the Sell section, set your token amount and price, and submit the order for others
            to purchase.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. How do I buy tokens on Kaspiano?</strong>
            <br />
            Go to the Buy section on your dashboard, select a sell order, and confirm your purchase.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            Mainnet & Testnet
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. What is the difference between Mainnet and Testnet?</strong>
            <br />
            Mainnet is the live environment for real tokens, while Testnet allows users to test features without
            real tokens.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How do I access Kaspiano Testnet?</strong>
            <br />
            Switch your Kasware network to Testnet 10 and visit the Kaspa Testnet Faucet to obtain testnet tokens.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ textDecoration: 'underline' }}>
            About Kaspiano
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. What is Kaspiano's mission?</strong>
            <br />
            Kaspiano’s mission is to empower the Kaspa community by providing secure, transparent tools for
            managing and trading KRC-20 tokens.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. Who can join Kaspiano?</strong>
            <br />
            Anyone interested in the Kaspa ecosystem can join, whether they are beginners or experienced traders.
        </Typography>
    </Container>
);

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;
