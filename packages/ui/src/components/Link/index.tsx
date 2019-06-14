import * as React from "react";
import {Link as ReactLink} from "react-router-dom";
import styled from "styled-components";

export interface Props {
  to: string;
  children: React.ReactNode;
}

const StyledLink = styled(ReactLink)`
  color: ${props => props.theme.colors.textSecondary};
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;

export const Link = (props: Props) => (
  <StyledLink to={props.to}>{props.children}</StyledLink>
);
