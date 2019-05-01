import baseStyled, {ThemedStyledInterface} from "styled-components";
import {Theme} from "../src/styles/theme";

export {ThemeProvider} from "styled-components";

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}
