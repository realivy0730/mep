// 定義主題介面
export interface ThemeConfig {
    name: string;
    colors: {
        primary: string;
        down: string;
        up: string;
        white: string;
        bgLight: string;
        tableStriped: string;
        borderDisabled: string;
        placeholder: string;
        textSecondary: string;
        textPrimary: string;
    };
    typography: {
        headings: {
            h1: string;
            h2: string;
            h3: string;
        };
        link: {
            default: string;
            hover: string;
        };
    };
}
