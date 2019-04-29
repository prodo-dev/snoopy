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
export const pinkTheme: Theme = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
    border: "#993f6c",
    text: "#ffb4d9",
    textSecondary: "#FF69B4",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "Ubuntu, mononspace",
  },
  fontSizes: {
    title: "18pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "11pt",
    detail: "8pt",
  },
};

export const greenTheme: Theme = {
  colors: {
    bg: "#043b25",
    fg: "#032a1a",
    border: "#065535",
    text: "#9bbbae",
    textSecondary: "#508871",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "Ubuntu, mononspace",
  },
  fontSizes: {
    title: "20pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "11pt",
    detail: "8pt",
  },
};
