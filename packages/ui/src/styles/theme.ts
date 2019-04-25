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
    bg: "#282c34",
    fg: "#444851",
    text: "#f8f8f2",
    textSecondary: "#00e3a0",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
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
