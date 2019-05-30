import * as React from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Context, FilePath} from "../models";
import {State} from "../store";
import {margins} from "../styles";

interface EnhancedProps {
  context: Context;
  selectedPaths: Set<FilePath>;
}

const Components = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const Divider = styled.div`
  margin: 0 ${margins.large};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const HomePage = ({context, selectedPaths}: EnhancedProps) => {
  const matchingSelectedPaths = ({path}: {path: string}) =>
    selectedPaths === null || selectedPaths.has(path);
  const components = context.components.filter(matchingSelectedPaths);
  const fileError = context.errors.filter(matchingSelectedPaths);
  const errors = fileError.length !== 0 ? fileError[0].errors : [];
  const hasComponents = context.components.length !== 0;

  if (!hasComponents) {
    return <Readme />;
  }

  return (
    <StyledPage>
      <StyledPageContents>
        <Toggle>
          <Readme />
        </Toggle>
        <Errors errors={errors} />
        <Components className="components">
          {components.map((component, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <ComponentContainer
                component={component}
                themes={context.themes}
                styles={context.styles}
              />
            </React.Fragment>
          ))}
        </Components>
      </StyledPageContents>
    </StyledPage>
  );
};

// @snoopy:ignore
export default connect((state: State) => ({
  context: state.app.context,
  selectedPaths: state.app.selectedPaths,
}))(HomePage);
