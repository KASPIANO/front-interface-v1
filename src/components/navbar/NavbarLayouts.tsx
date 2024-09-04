import { useMediaQuery } from '@mui/material';
import { FC } from 'react';

interface NavbarLayoutsProps {
    LogoComponent: JSX.Element;
    MenuComponent: JSX.Element;
    SearchComponent: JSX.Element;
    WalletComponent: JSX.Element;
    ThemeComponent: JSX.Element;
}
export const NavbarLayouts: FC<NavbarLayoutsProps> = ({
    LogoComponent,
    MenuComponent,
    SearchComponent,
    ThemeComponent,
    WalletComponent,
}) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <>
            {!isMobile ? (
                <>
                    {LogoComponent}
                    {MenuComponent}
                    {SearchComponent}
                    {WalletComponent}
                    {ThemeComponent}
                </>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        width: '100%',
                    }}
                >
                    <div>{MenuComponent}</div>
                    <div>{LogoComponent}</div>
                </div>
            )}
        </>
    );
};
