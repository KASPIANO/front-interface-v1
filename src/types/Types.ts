// In ../../../types/Types.ts

export interface Token {
    tick: string;
    logoURI?: string;
    symbol?: string;
    logo?: string;
    state: string;
    max: string;
    minted: string;
    pre?: string;
    mtsAdd: string;
    holder?: any[];
}

export interface TokenResponse {
    tick: string;
    maxSupply: string;
    minted: string;
    state: string;
    logo: string;
}

export interface InputContainerProps {
    active: boolean;
}

export interface NavButtonsProps {
    isOpen: boolean;
}

export interface NavButtonProps {
    isActive: boolean;
}

export interface NavItemProps {
    isActive: boolean;
}
