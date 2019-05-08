import * as _ from "lodash";
import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Component} from "../../models";
import {paddings} from "../../styles";

const StyledComponentList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ComponentName = styled.div<{selected?: boolean}>`
  overflow-x: hidden;
  text-overflow: ellipsis;
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
  components: Component[];
}

export default (props: Props) => {
  const files = _.uniq(props.components.map(({path}) => path));
  return (
    <StyledComponentList className="component-list">
      {files.map(path => (
        <StyledLink to={`/${path}`} key={path}>
          <ComponentName selected={props.selected === path}>
            {path}
          </ComponentName>
        </StyledLink>
      ))}
    </StyledComponentList>
  );
};
