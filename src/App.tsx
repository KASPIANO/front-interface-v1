import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import Cookies from 'universal-cookie';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { useKasware } from './hooks/useKasware';
import { KaspianoRouter } from './KaspianoRouter';
import { ThemeContext } from './main';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { getLocalThemeMode, ThemeModes } from './utils/Utils';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const {
        walletAddress,
        walletBalance,
        walletConnected,
        network,
        connectWallet,
        disconnectWallet,
        setNewBalance,
        isUserReferralFinishedLoading,
        updateAndGetUserReferral,
        userReferral,
    } = useKasware();

    const [backgroundBlur, setBackgroundBlur] = useState(false);

    const toggleThemeMode = () => {
        const newMode = themeMode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
        localStorage.setItem('theme_mode', newMode);
        setThemeMode(newMode);
    };

    // const checkCookie = async () => {
    //     const cookies = new Cookies(); // Create an instance of cookies-universal
    //     const cookieValue = cookies.get('user'); // Replace 'myCookie' with your cookie name
    //     if (cookieValue && Date.now() > cookieValue.expiresAt) {
    //         await disconnectWallet();
    //         cookies.remove('user');
    //     }
    // };

    // Set up an interval to check the cookie every 1 minute
    useEffect(() => {
        // const interval = setInterval(async () => {
        //     await checkCookie();
        // }, 1000); // Check every 60,000 milliseconds (1 minute)

        const updateTokensInterval = setInterval(setNewBalance, 10 * 1000);

        // Cleanup function to clear the interval when component unmounts
        return () => {
            // clearInterval(interval);
            clearInterval(updateTokensInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return themeMode ? (
        <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
            <ThemeProvider theme={themeMode === ThemeModes.DARK ? darkTheme : lightTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Navbar
                        walletConnected={walletConnected}
                        walletAddress={walletAddress}
                        network={network}
                        walletBalance={walletBalance}
                        connectWallet={connectWallet}
                        disconnectWallet={disconnectWallet}
                        setBackgroundBlur={setBackgroundBlur}
                        backgroundBlur={backgroundBlur}
                    />
                    <KaspianoRouter
                        backgroundBlur={backgroundBlur}
                        network={network}
                        walletAddress={walletAddress}
                        walletBalance={walletBalance}
                        walletConnected={walletConnected}
                        connectWallet={connectWallet}
                        isUserReferralFinishedLoading={isUserReferralFinishedLoading}
                        updateAndGetUserReferral={updateAndGetUserReferral}
                        userReferral={userReferral}
                    />
                    <Footer />
                </BrowserRouter>
            </ThemeProvider>
        </ThemeContext.Provider>
    ) : null;
};

export default App;
