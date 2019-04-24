import {css} from "styled-components";

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

export const paddings = {
  none: "0",
  small: "0.5rem",
  medium: "1rem",
  large: "2rem",
};
export const margins = paddings;

export const SidebarWidth = "200px";
export const MinSidebarWidth = "40px";
export const LogoWidth = "20px";

export const narrowScreenWidth = 768;
export const forNarrowScreen = (
  first: any,
  ...interpolations: any[]
) => `@media only screen ${narrowScreenWidth != null &&
  ` and (max-width: ${narrowScreenWidth}px)`} {
  ${css(first, ...interpolations)}
}`;
export const forWideScreen = (
  first: any,
  ...interpolations: any[]
) => `@media only screen ${narrowScreenWidth != null &&
  ` and (min-width: ${narrowScreenWidth}px)`} {
  ${css(first, ...interpolations)}
}`;
