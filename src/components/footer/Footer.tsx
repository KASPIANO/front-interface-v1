import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { FooterContainer, FooterContent, SocialMediaContainer } from './Footer.s';
import Avatar from '@mui/material/Avatar';
import { BottomNavigationAction, Typography } from '@mui/material';

const Footer: React.FC = () => (
    <FooterContainer>
        <FooterContent>
            <Typography sx={{ fontSize: '1.2vw', marginRight: '0.5vw' }}>v1.0.0</Typography>
            <Typography sx={{ fontSize: '1.2vw' }}>Kaspulse</Typography>
            <SocialMediaContainer>
                <BottomNavigationAction label="Github" icon={<GitHubIcon />} />
                <BottomNavigationAction label="Github" icon={<CloseRoundedIcon />} />
                <BottomNavigationAction
                    label="Github"
                    icon={
                        <Avatar
                            src="/discord.svg"
                            alt="Discord"
                            sx={{ width: 24, height: 24, marginRight: 1, cursor: 'pointer' }}
                        />
                    }
                />
            </SocialMediaContainer>
        </FooterContent>
    </FooterContainer>
);

export default Footer;
