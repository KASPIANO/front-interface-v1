import React, { useEffect } from 'react';
import { BackgroundContainer, Token } from './BackgroundEffect.s';

const BackgroundEffect: React.FC = () => {
    useEffect(() => {
        const tokens = document.querySelectorAll<HTMLDivElement>('.token');
        tokens.forEach((token) => {
            const duration = `${Math.random() * 8 + 5}s`; // Random duration between 5s and 13s
            const delay = `${Math.random() * 2}s`; // Random delay up to 2s
            token.style.setProperty('--duration', duration);
            token.style.setProperty('--delay', delay);
        });
    }, []);

    return (
        <BackgroundContainer>
            <Token className="token" style={{ backgroundImage: "url('/kasper.svg')", top: '45%', left: '5%' }} />
            <Token className="token" style={{ backgroundImage: "url('/kaspa.svg')", top: '20%', left: '75%' }} />
            <Token className="token" style={{ backgroundImage: "url('/nacho.svg')", top: '30%', left: '30%' }} />
            <Token className="token" style={{ backgroundImage: "url('/kspr.jpg')", top: '80%', left: '70%' }} />
            <Token
                className="token"
                style={{ backgroundImage: "url('/dagknightdog.jpg')", top: '50%', left: '20%' }}
            />
            <Token
                className="token"
                style={{ backgroundImage: "url('/kaspacats.jpg')", top: '60%', left: '80%' }}
            />
            <Token className="token" style={{ backgroundImage: "url('/keke.jpg')", top: '48%', left: '60%' }} />
            <Token className="token" style={{ backgroundImage: "url('/usdc.svg')", top: '80%', left: '9%' }} />
        </BackgroundContainer>
    );
};

export default BackgroundEffect;
