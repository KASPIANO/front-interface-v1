import { Container, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import {
    FooterContainer,
    FooterContent,
    FooterLink,
    FooterList,
    RightsReserved,
    SocialMediaIcons,
} from './Footer.s';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer: React.FC = () => (
    <FooterContainer>
        <Container maxWidth="lg">
            <FooterContent container>
                {/* Social Media Icons Section */}
                <Grid item container xs={4} md={4} sm={4} lg={4} direction="column" rowGap={1}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <SocialMediaIcons>
                            <IconButton
                                aria-label="GitHub"
                                href="https://github.com/orgs/KASPIANO/repositories"
                                target="_blank"
                            >
                                <GitHubIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Twitter" href="https://x.com/KaspianoApp" target="_blank">
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="Telegram" href="https://t.me/KaspianoApp" target="_blank">
                                <TelegramIcon fontSize="small" />
                            </IconButton>
                        </SocialMediaIcons>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <FooterLink
                            gutterBottom
                            href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf"
                            target="_blank"
                            sx={{ fontSize: '0.8rem', color: '#49EACB' }}
                        >
                            Kasware Wallet Extension
                        </FooterLink>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <RightsReserved gutterBottom sx={{ fontSize: '0.8rem' }}>
                            © 2021 Kaspiano. All rights reserved.
                        </RightsReserved>
                    </Grid>
                </Grid>

                {/* Links Section */}
                <Grid item container xs={8} md={8} sm={8} lg={8}>
                    <Grid item xs={3} md={3} sm={3} lg={3}>
                        <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                            App
                        </Typography>
                        <FooterList>
                            <li>
                                <FooterLink href="/">Home</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/deploy">Deploy</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/portfolio">Portfolio</FooterLink>
                            </li>
                        </FooterList>
                    </Grid>

                    <Grid item xs={3} md={3} sm={3} lg={3}>
                        <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                            About us
                        </Typography>
                        <FooterList>
                            <li>
                                <FooterLink href="/team">Team</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/faq">FAQs</FooterLink>
                            </li>
                        </FooterList>
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} lg={3}>
                        <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                            Need Help?
                        </Typography>
                        <FooterList>
                            <li>
                                <FooterLink href="/contact-us">Contact us</FooterLink>
                            </li>
                        </FooterList>
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} lg={3}>
                        <Typography gutterBottom sx={{ fontSize: '0.85rem' }}>
                            Resources
                        </Typography>
                        <FooterList>
                            <li>
                                <FooterLink href="/terms-service">Terms of Service</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                            </li>
                            <li>
                                <FooterLink href="/trade-terms">Terms of Trade</FooterLink>
                            </li>
                            {/* <li>
                                <FooterLink href="/trust-safety">Trust Safety</FooterLink>
                            </li> */}
                        </FooterList>
                    </Grid>
                </Grid>

                {/* Legal Section */}
            </FooterContent>
        </Container>
    </FooterContainer>
);

export default Footer;
