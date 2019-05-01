import {css} from "styled-components";

export const paddings = {
  none: "0",
  small: "0.5rem",
  medium: "1rem",
  large: "2rem",
};
export const margins = paddings;

export const SidebarWidth = "200px";
export const SidebarClosedWidth = "55px";
export const LogoWidth = "20px";

export const NarrowScreenWidth = 768;

export const forNarrowScreen = (first: any, ...interpolations: any[]) => css`
  @media only screen ${NarrowScreenWidth != null &&
      css` and (max-width: ${NarrowScreenWidth}px)`} {
    ${css(first, ...interpolations)}
  }
`;

export const forWideScreen = (first: any, ...interpolations: any[]) => css`
  @media only screen ${NarrowScreenWidth != null &&
      css` and (min-width: ${NarrowScreenWidth}px)`} {
    ${css(first, ...interpolations)}
  }
`;
