import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: {
        primary: string;
        secondary: string;
        info: string;
        success: string;
        footer: string;
        blueViolet: string;
        pinkRed: string;
        greenCyan: string;
        greyGradient: string;
        pinkRedHover: string;
        lightGrey: string;
      };
      colors: {
        indigo: {
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
          500: string;
          600: string;
          700: string;
          800: string;
          900: string;
          alpha: {
            5: string;
            10: string;
            20: string;
          };
        };
        purple: {
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
          500: string;
          600: string;
          700: string;
          800: string;
          900: string;
          alpha: {
            5: string;
            10: string;
            20: string;
          };
        };
        blue: {
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
          500: string;
          600: string;
          700: string;
          800: string;
          900: string;
          alpha: {
            5: string;
            10: string;
            20: string;
          };
        };
        cyan: {
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
          500: string;
          600: string;
          700: string;
          800: string;
          900: string;
          alpha: {
            5: string;
            10: string;
            20: string;
          };
        };
        white: {
          alpha: {
            5: string;
            10: string;
            20: string;
            95: string;
          };
        };
        black: {
          alpha: {
            10: string;
            15: string;
            30: string;
            70: string;
          };
        };
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      gradients?: {
        primary?: string;
        secondary?: string;
        info?: string;
        success?: string;
        footer?: string;
        blueViolet?: string;
        pinkRed?: string;
        greenCyan?: string;
        greyGradient?: string;
        pinkRedHover?: string;
        lightGrey?: string;
      };
      colors?: {
        indigo?: any;
        purple?: any;
        blue?: any;
        cyan?: any;
        white?: any;
        black?: any;
      };
    };
  }
}