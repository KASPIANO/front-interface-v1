import { createTheme } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles/createPalette';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F5F5F7',
        },
        primary: {
            main: '#70C7BA', // Primary color
        },
        secondary: {
            main: '#49EACB', // Secondary color
        },
        info: {
            main: '#767676',
        },
        low: {
            main: '#D76B66',
        },
        medium: {
            main: '#F6CF7D',
        },
        high: {
            main: '#3c6ed4',
        },
        critical: {
            main: '#660000',
        },
        black: {
            main: '#231F20',
        },
        neutral: {
            main: '#B6B6B6',
        },
        red: {
            main: '#D76B66',
        },
        green: {
            main: '#75C57F',
        },
        blue: {
            main: '#73ACEF',
        },
        // Customize other palette colors as needed
    } as PaletteOptions,
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontFamily: 'Inter, sans-serif',
        },
        h2: {
            fontFamily: 'Inter, sans-serif',
        },
        h3: {
            fontFamily: 'Inter, sans-serif',
        },
        h4: {
            fontFamily: 'Inter, sans-serif',
        },
        h5: {
            fontFamily: 'Inter, sans-serif',
        },
        h6: {
            fontFamily: 'Inter, sans-serif',
        },
        subtitle1: {
            fontFamily: 'Oswald, sans-serif',
        },
        subtitle2: {
            fontFamily: 'Oswald, sans-serif',
        },
        // Customize typography as needed
    },
    components: {
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: 'rgba(0, 0, 0, 0.87)',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                sizeSmall: {
                    paddingTop: '3px',
                    color: 'white',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    color: 'black',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
            styleOverrides: {
                root: {
                    color: 'black',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#70C7BA', // Primary color
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: 'black',
                },
            },
        },
        // Customize other component configurations as needed
    },
    shadows: createTheme().shadows, // Customize shadow options
    shape: {
        borderRadius: 8, // Customize border radius
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    transitions: {
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
    zIndex: {
        appBar: 1200,
        drawer: 1100,
    },
    // Customize other theme configurations as needed
});
