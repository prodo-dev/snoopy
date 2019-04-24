import * as React from "react";
import MediaQuery from "react-responsive";
import {narrowScreenWidth} from "../../styles/theme";

export interface Props {
  children?: React.ReactNode;
}

export const NarrowScreen = (props: Props) => (
  <MediaQuery maxWidth={narrowScreenWidth}>{props.children}</MediaQuery>
);

export const WideScreen = (props: Props) => (
  <MediaQuery minWidth={narrowScreenWidth}>{props.children}</MediaQuery>
);
