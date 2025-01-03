import React from 'react';
import { Box, Container, Divider, Link, Typography } from '@mui/material';

const FAQ: React.FC = () => (
    <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h5" gutterBottom>
                Navigate the FAQ
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box sx={{ width: '23%' }}>
                    <Link
                        href="#trade-process"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Trade Process
                    </Link>
                    <Link
                        href="#trading-platform-rules"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Trading & Platform Rules
                    </Link>
                    <Link
                        href="#security-reliability"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Security & Reliability
                    </Link>
                </Box>
                <Box sx={{ width: '23%' }}>
                    <Link
                        href="#user-verification"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        User Verification
                    </Link>
                    <Link
                        href="#resources-programs"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Resources & Programs
                    </Link>
                    <Link
                        href="#getting-started"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Getting Started
                    </Link>
                </Box>
                <Box sx={{ width: '23%' }}>
                    <Link href="#fees" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                        Fees
                    </Link>
                    <Link
                        href="#referral-program"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Referral Program
                    </Link>
                    <Link
                        href="#kaspiano-airdrop"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Kaspiano Airdrop
                    </Link>
                </Box>
                <Box sx={{ width: '23%' }}>
                    <Link
                        href="#mainnet-testnet"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Mainnet & Testnet
                    </Link>
                    <Link
                        href="#about-kaspiano"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        About Kaspiano
                    </Link>
                </Box>
                <Box sx={{ width: '23%' }}>
                    <Link href="#features" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                        Features
                    </Link>
                    <Link
                        href="#launchpad-tool"
                        underline="hover"
                        sx={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                        Launchpad Tool
                    </Link>
                    <Link href="#airdrop-tool" underline="hover" sx={{ display: 'block', marginBottom: '0.5rem' }}>
                        Airdrop Tool
                    </Link>
                </Box>
            </Box>
            <Divider />
        </Box>

        <Typography variant="h6" id="trade-process" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="trading-platform-rules" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="security-reliability" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="user-verification" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="resources-programs" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="getting-started" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="fees" gutterBottom sx={{ textDecoration: 'underline' }}>
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
        <Typography variant="h6" id="referral-program" gutterBottom sx={{ textDecoration: 'underline' }}>
            Referral Program
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How does the referral program work?</strong>
            <br />
            Kaspiano takes pride in offering some of the lowest trading fees in the market, at just 2.5%. As part
            of our commitment to the community, we allocate 20% of this fee (equivalent to 0.5% of the total)
            towards our referral program. This means that users can earn KAS payments by sharing their referral
            links and inviting others to trade on the platform.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How are referral rewards calculated?</strong>
            <br />
            Referral rewards are based on the trading volume and activity generated by the users you refer. The
            more active your referrals, the more KAS you can earn. Both community-driven referrals and
            user-specific referrals are eligible to receive rewards.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. When can I withdraw my referral rewards?</strong>
            <br />
            Soon, you will be able to withdraw your KAS referral earnings directly from the Portfolio page.
            Withdrawals will be available bi-weekly, allowing you to regularly claim your rewards.
        </Typography>

        <Typography variant="h6" id="kaspiano-airdrop" gutterBottom sx={{ textDecoration: 'underline' }}>
            Kaspiano Airdrop
        </Typography>

        <Typography variant="body1" paragraph>
            <strong>1. Will Kaspiano have its own token?</strong>
            <br />
            Yes, Kaspiano will have its own token.
        </Typography>

        <Typography variant="body1" paragraph>
            <strong>2. What are the criteria to be eligible for the airdrop?</strong>
            <br />
            Users will become eligible for the airdrop by actively engaging with the Kaspiano platform. To qualify,
            you can:
            <ul>
                <li>Sell tokens</li>
                <li>Buy tokens</li>
                <li>Deploy tokens</li>
                <li>Utilize the airdrop tokens tool</li>
                <li>Mint tokens</li>
            </ul>
        </Typography>

        <Typography variant="body1" paragraph>
            <strong>3. When will the token be airdropped?</strong>
            <br />
            The exact date for the airdrop will be announced as we approach the event. The timing will depend on
            favorable market conditions and Kaspiano's growth and readiness.
        </Typography>

        <Typography variant="body1" paragraph>
            <strong>4. What is the utility of the Kaspiano token?</strong>
            <br />
            The token's utility is still under development and will be disclosed at a later date.
        </Typography>

        <Typography variant="h6" id="features" gutterBottom sx={{ textDecoration: 'underline' }}>
            Features
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How do I mint tokens on Kaspiano?</strong>
            <br />
            Connect your wallet, go to the KRC-20 token dashboard or the Page of the token, and select the Mint
            option to create new tokens.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How do Deploy mint tokens on Kaspiano?</strong>
            <br />
            Connect your wallet, go to the Deploy page and fill out the fields needed for it, and it will cost
            1000KAS which goes to the miners.
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
        <Typography variant="h6" id="airdrop-tool" gutterBottom sx={{ textDecoration: 'underline' }}>
            Airdrop Tool
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How do I use the Airdrop Tool on Kaspiano?</strong>
            <br />
            Follow these steps to successfully execute an airdrop:
            <ul>
                <li>Add the ticker for the token you wish to airdrop.</li>
                <li>
                    Import a CSV file containing wallet addresses and the corresponding amounts for each recipient.
                </li>
                <li>Review the uploaded wallet list and amounts to ensure everything is correct.</li>
                <li>Use one credit to start the airdrop process. Ensure you have sufficient credits.</li>
            </ul>
            Each credit allows you to perform one airdrop.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How much does the Airdrop Tool cost?</strong>
            <br />
            The Airdrop Tool costs <strong>500 KAS</strong> for 3 credits. Each credit can be used for one airdrop.
            Unused credits remain available for future airdrops.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. How does Kaspiano handle duplicates in the wallet list?</strong>
            <br />
            The Airdrop Tool automatically removes duplicate wallet addresses, ensuring no recipient is credited
            more than once.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>4. Can I track the airdrop process?</strong>
            <br />
            Yes, the Airdrop Tool provides real-time updates on the status of each wallet in the list. You can
            monitor progress directly from the platform.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>5. Important Notes for Using the Airdrop Tool</strong>
            <br />
            While the airdrop is in progress:
            <ul>
                <li>Do not close your internet connection.</li>
                <li>It is recommended to keep the Kaspiano platform open to ensure smooth processing.</li>
            </ul>
            Interrupting the process may cause delays or failures in the airdrop.
        </Typography>

        <Typography variant="h6" id="launchpad-tool" gutterBottom sx={{ textDecoration: 'underline' }}>
            Launchpad Tool
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>1. How do I create a Launchpad on Kaspiano?</strong>
            <br />
            Go to the "Create Launchpad" section, and follow these steps:
            <ul>
                <li>Ensure your tokens are pre-minted and available in your wallet.</li>
                <li>
                    Fill out the fields, such as Ticker, Kas Per Batch, and Tokens Per Batch. Optional fields
                    include min/max batches per order and batch limits per wallet.
                </li>
                <li>
                    Enable the Whitelist if you want to restrict participation to specific wallet addresses. Upload
                    a CSV file with the wallet addresses if enabled.
                </li>
            </ul>
            Once completed, your Launchpad will be created. Manage it further in the "My Launchpads" section.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>2. How do I fund my Launchpad?</strong>
            <br />
            To fund your Launchpad, deposit the tokens and gas (Kaspa) required for transactions. Ensure you have
            enough for buyers to receive their tokens and to cover transaction fees.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>3. Can I update or stop my Launchpad?</strong>
            <br />
            Yes, you can update settings like token price and whitelist configuration or stop your Launchpad.
            Stopping it will finish any open orders before ceasing new purchases.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>4. What are the fees associated with the Launchpad?</strong>
            <br />
            Kaspiano charges a <strong>2.5% fee</strong> on the total funds raised during withdrawals.
        </Typography>
        <Typography variant="body1" paragraph>
            <strong>5. How do I withdraw funds from the Launchpad?</strong>
            <br />
            To withdraw funds (tokens or gas), first stop your Launchpad. Once all orders are processed, you can
            withdraw the remaining funds.
        </Typography>

        <Typography variant="h6" id="mainnet-testnet" gutterBottom sx={{ textDecoration: 'underline' }}>
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

        <Typography variant="h6" id="about-kaspiano" gutterBottom sx={{ textDecoration: 'underline' }}>
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
