import { Helmet } from 'react-helmet-async';

const Seo = () => (
    <>
        <Helmet>
            {/* Basic Metadata */}
            <title>Kaspiano | Trade KRC-20 Tokens</title>
            <meta
                name="description"
                content="Trade, Deploy, Airdrop, and Mint KRC-20 tokens on the Kaspiano platform. The ultimate resource for KRC-20 token exploration and tools."
            />
            <meta
                name="keywords"
                content="Kaspiano, Kaspa, KRC-20 tokens, blockchain, airdrop, deploy KRC-20, trade crypto"
            />

            {/* Open Graph Metadata */}
            <meta property="og:title" content="Kaspiano | Trade KRC-20 Tokens" />
            <meta
                property="og:description"
                content="Trade, Deploy, Airdrop, and Mint KRC-20 tokens on the Kaspiano platform."
            />
            <meta property="og:url" content="https://kaspiano.com" />
            <meta property="og:image" content="https://kaspiano.com/Logo.png" />
            <meta property="og:type" content="website" />

            {/* Twitter Card Metadata */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Kaspiano | Trade KRC-20 Tokens" />
            <meta
                name="twitter:description"
                content="Trade, Deploy, Airdrop, and Mint KRC-20 tokens on the Kaspiano platform."
            />
            <meta name="twitter:image" content="https://kaspiano.com/Logo.png" />
            <meta name="twitter:site" content="@KaspianoApp" />

            {/* Structured Data (Rich Snippets) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Kaspiano',
                    url: 'https://kaspiano.com',
                    description:
                        'Trade, Deploy, Airdrop, and Mint KRC-20 tokens on the Kaspiano platform. The ultimate resource for KRC-20 token exploration and tools.',
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: [
                            {
                                '@type': 'SoftwareApplication',
                                name: 'KRC-20 Tokens',
                                description: 'Explore KRC-20 token',
                                url: 'https://www.kaspiano.com/KRC-20',
                                mainEntityOfPage: {
                                    '@type': 'WebPage',
                                    '@id': 'https://www.kaspiano.com/KRC-20',
                                },
                            },
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Airdrop',
                                description: 'Airdrop tool for KRC-20 tokens.',
                                url: 'https://www.kaspiano.com/airdrop',
                                mainEntityOfPage: {
                                    '@type': 'WebPage',
                                    '@id': 'https://www.kaspiano.com/airdrop',
                                },
                            },
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Deploy',
                                description: 'Deploy your own KRC-20 token on the Kaspiano platform.',
                                url: 'https://www.kaspiano.com/deploy',
                                mainEntityOfPage: {
                                    '@type': 'WebPage',
                                    '@id': 'https://www.kaspiano.com/deploy',
                                },
                            },
                        ],
                    },
                })}
            </script>
        </Helmet>
    </>
);

export default Seo;
