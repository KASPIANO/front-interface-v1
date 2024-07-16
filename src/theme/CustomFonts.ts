export enum CustomFontFamily {
    inter = 'Inter',
    avertastd = 'Avertastd',
    roboto = 'Roboto',
}

export const getFontName = (familyName: CustomFontFamily) => ({
    italic: `${familyName}Italic`,
    black: `${familyName}Black`,
    blackItalic: `${familyName}BlackItalic`,
    bold: `${familyName}Bold`,
    boldItalic: `${familyName}BoldItalic`,
    extraBold: `${familyName}ExtraBold`,
    extraBoldItalic: `${familyName}ExtraBoldItalic`,
    light: `${familyName}Light`,
    lightItalic: `${familyName}LightItalic`,
    extraLight: `${familyName}ExtraLight`,
    extraLightItalic: `${familyName}ExtraLightItalic`,
    medium: `${familyName}Medium`,
    mediumItalic: `${familyName}MediumItalic`,
    regular: `${familyName}Regular`,
    semiBold: `${familyName}SemiBold`,
    semiBoldItalic: `${familyName}SemiBoldItalic`,
    thin: `${familyName}Thin`,
    thinItalic: `${familyName}ThinItalic`,
    extraThin: `${familyName}ExtraThin`,
    extraThinItalic: `${familyName}ExtraThinItalic`,
});
