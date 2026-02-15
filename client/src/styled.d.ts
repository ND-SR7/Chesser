import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      base: string;
      accent: string;
      background: string;
      backgroundModal: string;
      text: string;
    };
    fontSizes: {
      small: string;
      normal: string;
      big: string;
      bigger: string;
      huge: string;
    };
    fontWeights: {
      normal: number;
      semiBold: number;
      bold: number;
      heavyBold: number;
    };
    paddings: {
      standard: string;
      bigger: string;
      large: string;
    };
    margins: {
      standard: string;
      bigger: string;
      large: string;
    };
    borders: {
      standardBlack: string;
      standardBlue: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      big: string;
    };
    widths: {
      third: string;
      half: string;
      full: string;
    };
    heights: {
      third: string;
      half: string;
      full: string;
    };
    flex: {
      justify: string;
      wrap: string;
    };
  }
}
