export type Color = string;
export type Font = string;
export type Size = string;

export interface Theme {
  colors: {
    bg: Color;
    fg: Color;
    border: Color;
    text: Color;
    textSecondary: Color;
    textTertiary: Color;
    error: Color;
    errorBg: Color;
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

// @prodo:theme
export const darkTheme: Theme = {
  colors: {
    bg: "#282c34",
    fg: "#31353f",
    border: "#444851",
    text: "#f8f8f2",
    textSecondary: "#00e3a0",
    textTertiary: "#cfcfc3",
    error: "#E00700",
    errorBg: "#f8f8f2",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "'Source Code Pro', 'Consolas', monospace",
  },
  fontSizes: {
    title: "18pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "11pt",
    detail: "8pt",
  },
};
