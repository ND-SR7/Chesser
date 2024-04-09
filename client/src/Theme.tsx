import { ThemeProvider } from "styled-components";

const BaseTheme = {
  colors: {
    base: "lightblue",
    background: "whitesmoke",
    backgroundModal: "rgba(0,0,0,0.4)"
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

export default function Theme({children}: any) {
  return <ThemeProvider theme={BaseTheme}>{children}</ThemeProvider>;
};
