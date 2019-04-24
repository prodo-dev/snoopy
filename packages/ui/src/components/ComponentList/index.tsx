import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {components} from "../../../components-generated";
import {paddings} from "../../styles/theme";

const StyledComponentList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ComponentName = styled.div<{selected?: boolean}>`
  text-decoration: none;
  padding: ${paddings.small} ${paddings.medium};
  ${props => props.selected && `background-color: ${props.theme.colors.bg}`}
  font-size: ${props => props.theme.fontSizes.subtitle};
  color: ${props => props.theme.colors.text};

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

interface Props {
  selected?: string;
}

export default (props: Props) => (
  <StyledComponentList>
    {components.map(({name, component}) => (
      <StyledLink to={`/${name}`} key={name}>
        <ComponentName selected={props.selected === name}>{name}</ComponentName>
      </StyledLink>
    ))}
  </StyledComponentList>
);
