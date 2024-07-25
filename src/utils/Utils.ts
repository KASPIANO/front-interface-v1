export enum ThemeModes {
    DARK = 'dark',
    LIGHT = 'light',
}

export const getLocalThemeMode = () =>
    localStorage.getItem('theme_mode') ? (localStorage.getItem('theme_mode') as ThemeModes) : ThemeModes.DARK;

export const setWalletBalanceUtil = (balanceInKaspa: number) =>
    isNaN(balanceInKaspa) ? 0 : parseFloat(balanceInKaspa.toFixed(4));

export function simplifyNumber(value) {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(0)}T`;
    } else if (value >= 1e9) {
        return `${(value / 1e9).toFixed(0)}B`;
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(0)}M`;
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(0)}K`;
    } else {
        return value.toString();
    }
}
export function formatNumberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
