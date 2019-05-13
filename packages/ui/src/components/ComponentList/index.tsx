import * as _ from "lodash";
import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Component} from "../../models";
import {paddings} from "../../styles";

const StyledComponentList = styled.div``;

const StyledFileTree = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};

  &:hover {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const Directory = styled.span<{level: number}>`
  display: block;
  padding: ${paddings.small};
  padding-left: calc(${paddings.medium} * (${props => props.level} + 1));
  cursor: default;
  color: ${props => props.theme.colors.textTertiary};

  &::after {
    content: "/";
  }
`;

const File = styled.span<{level: number; selected: boolean}>`
  display: block;
  padding: ${paddings.small};
  padding-left: calc(${paddings.medium} * (${props => props.level} + 1));
  ${props => props.selected && `background-color: ${props.theme.colors.bg};`}
`;

interface Props {
  components: Component[];
  selected?: string;
}

type File = string;
interface Directory {
  [segment: string]: Directory | File;
}

const ComponentList = ({components, selected}: Props) => {
  const paths = _.uniq(components.map(({path}) => path));
  const structure: Directory = {};
  for (const path of paths) {
    const segments = path.split("/");
    let current = structure;
    for (const segment of segments.slice(0, segments.length - 1)) {
      if (current[segment] == null) {
        current[segment] = {};
      }
      const child = current[segment];
      if (typeof child === "string") {
        throw new Error(`"${segment}" is both a directory and a file.`);
      }
      current = child;
    }
    current[segments[segments.length - 1]] = path;
  }

  return (
    <StyledComponentList className="component-list">
      <FileTree structure={structure} level={0} selected={selected} />
    </StyledComponentList>
  );
};

const FileTree = ({
  structure,
  level,
  selected,
}: {
  structure: Directory;
  level: number;
  selected: string | undefined;
}) => (
  <StyledFileTree>
    {Object.keys(structure)
      .sort()
      .map(segment => {
        const child = structure[segment];
        if (typeof child === "string") {
          return (
            <li key={segment}>
              <StyledLink to={child}>
                <File level={level} selected={child === selected}>
                  {segment}
                </File>
              </StyledLink>
            </li>
          );
        } else {
          return (
            <li key={segment}>
              <Directory level={level}>{segment}</Directory>
              <FileTree
                structure={child}
                level={level + 1}
                selected={selected}
              />
            </li>
          );
        }
      })}
  </StyledFileTree>
);

// @prodo
export default ComponentList;
