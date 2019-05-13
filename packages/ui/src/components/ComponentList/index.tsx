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

interface FileProps {
  level: number;
  selected?: boolean;
}

const StyledDirectory = styled.span<FileProps>`
  display: block;
  padding: ${paddings.small};
  padding-left: calc(${paddings.medium} * (${props => props.level} + 1));
  cursor: default;
  color: ${props => props.theme.colors.textTertiary};

  &::after {
    content: "/";
  }
`;

const StyledFile = styled.span<FileProps>`
  display: block;
  padding: ${paddings.small};
  padding-left: calc(${paddings.medium} * (${props => props.level} + 1));
  ${props => props.selected && `background-color: ${props.theme.colors.bg};`}
`;

interface Props {
  components: Component[];
  selected: FilePath[];
  select: (selection: FilePath[]) => any;
}

export type FilePath = string;

interface Directory {
  [segment: string]: Directory | FilePath;
}

const ComponentList = ({components, selected, select}: Props) => {
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
      <FileTree
        structure={structure}
        level={0}
        selected={selected}
        select={select}
      />
    </StyledComponentList>
  );
};

const FileTree = ({
  structure,
  level,
  selected,
  select,
}: {
  structure: Directory;
  level: number;
  selected: FilePath[];
  select: (selection: FilePath[]) => any;
}) => (
  <StyledFileTree>
    {Object.keys(structure)
      .sort()
      .map(segment => {
        const child = structure[segment];
        if (typeof child === "string") {
          const isSelected = selected.includes(child);
          const add = () => select(selected.concat([child]).sort());
          const remove = () => select(selected.filter(s => s !== child));
          return (
            <li key={segment}>
              <StyledLink to={child}>
                <File level={level} selected={isSelected}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    onChange={event => {
                      event.stopPropagation();
                      if (event.target.checked) {
                        add();
                      } else {
                        remove();
                      }
                    }}
                  />{" "}
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
                select={select}
              />
            </li>
          );
        }
      })}
  </StyledFileTree>
);

const Directory = ({
  children,
  ...props
}: FileProps & {children: React.ReactNode}) => (
  <StyledDirectory {...props}>{children}</StyledDirectory>
);

const File = ({
  children,
  ...props
}: FileProps & {children: React.ReactNode}) => (
  <StyledFile {...props}>{children}</StyledFile>
);

// @prodo
export default ComponentList;
