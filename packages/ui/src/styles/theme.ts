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
    selected: Color;
    unselected: Color;
    partiallySelected: Color;
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

// @snoopy:theme
export const darkTheme: Theme = {
  colors: {
    bg: "#282c34",
    fg: "#31353f",
    border: "#444851",
    text: "#f8f8f2",
    textSecondary: "#00e3a0",
    textTertiary: "#cfcfc3",
    selected: "#ec6969",
    unselected: "#cfcfc3",
    partiallySelected: "#ff9797",
    error: "#E00700",
    errorBg: "#f8f8f2",
  },
  fonts: {
    text: '-apple-system, "Segoe UI", "Ubuntu", "Helvetica", sans-serif',
    code: '"Source Code Pro", "Menlo", "Consolas", monospace',
  },
  fontSizes: {
    title: "18pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "11pt",
    detail: "8pt",
  },
};
