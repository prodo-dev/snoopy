export type Color = string;
export type Font = string;
export type Size = string;

export interface Theme {
  colors: {
    bg: Color;
    fg: Color;
    text: Color;
    textSecondary: Color;
  };
  fonts: {
    text: Font;
    code: Font;
  };
  fontSizes: {
    title: Size;
    subtitle: Size;
    normal: Size;
    code: Size;
    detail: Size;
  };
}

export const darkTheme: Theme = {
  colors: {
    bg: "black",
    fg: "grey",
    text: "white",
    textSecondary: "hotpink",
  },
  fonts: {
    text: "sans-serif",
    code: "Ubuntu, mononspace",
  },
  fontSizes: {
    title: "16pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "11pt",
    detail: "8pt",
  },
};
