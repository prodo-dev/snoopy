import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {margins, MinSidebarWidth, paddings} from "../../styles/theme";
import ComponentList from "../ComponentList";
import Logo from "../Logo";

const StyledSidebar = styled.div`
  background-color: ${props => props.theme.colors.fg};
  min-width: ${MinSidebarWidth};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.div`
  text-decoration: none;
  padding: ${paddings.medium};
  font-size: ${props => props.theme.fontSizes.title};
  color: ${props => props.theme.colors.text};

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Separator = styled.hr`
  margin: ${margins.none};
`;

interface Props {
  selected?: string;
}

export default (props: Props) => (
  <StyledSidebar>
    <StyledLink to="/">
      <Title>
        <Logo />
        Snoopy
      </Title>
    </StyledLink>
    <Separator />
    <ComponentList selected={props.selected} />
  </StyledSidebar>
);
