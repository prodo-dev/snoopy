import * as React from "react";
import MediaQuery from "react-responsive";
import {NarrowScreenWidth} from "../../styles/theme";

export interface Props {
  children?: React.ReactNode;
}

export const NarrowScreen = (props: Props) => (
  <MediaQuery maxWidth={NarrowScreenWidth}>{props.children}</MediaQuery>
);

export const WideScreen = (props: Props) => (
  <MediaQuery minWidth={NarrowScreenWidth}>{props.children}</MediaQuery>
);
