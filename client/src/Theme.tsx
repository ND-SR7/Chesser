import { createGlobalStyle, ThemeProvider } from "styled-components";

interface ThemeProps {
  darkTheme: boolean;
  children: any;
}

const BaseTheme = {
  colors: {
    base: "lightblue",
    accent: "blue",
    background: "whitesmoke",
    backgroundModal: "rgba(0,0,0,0.4)",
    text: "black"
  },
  fontSizes: {
    small: "10px",
    normal: "16px",
    big: "24px",
    bigger: "36px",
    huge: "48px"
  },
  fontWeights: {
    normal: 400,
    semiBold: 500,
    bold: 700,
    heavyBold: 900
  },
  paddings: {
    standard: "5px",
    bigger: "10px",
    large: "20px"
  },
  margins: {
    standard: "5px",
    bigger: "10px",
    large: "20px"
  },
  borders: {
    standardBlack: "5px solid black",
    standardBlue: "5px solid blue",
  },
  borderRadius: {
    small: "5px",
    medium: "10px",
    big: "15px"
  },
  widths: {
    third: "33%",
    half: "50%",
    full: "100%"
  },
  heights: {
    third: "33%",
    half: "50%",
    full: "100%"
  },
  flex: {
    justify: "space-around",
    wrap: "wrap"
  }
};

const DarkTheme = {
  ...BaseTheme,
  colors: {
    base: "rgb(0,1,80)",
    accent: "lightblue",
    background: "rgb(0,6,30)",
    backgroundModal: "rgba(0,0,0,0.85)",
    text: "white"
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    color: ${({theme}) => theme.colors.text};
    background-color: ${({theme}) => theme.colors.background};
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export default function Theme({darkTheme, children}: ThemeProps) {
  return (
  <ThemeProvider theme={darkTheme ? DarkTheme : BaseTheme}>
    <GlobalStyle />
    {children}
  </ThemeProvider>
  );
};
