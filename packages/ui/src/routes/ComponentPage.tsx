import * as React from "react";
import {connect} from "react-redux";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Context, FilePath, Theme} from "../models";
import {State} from "../store";
import {actions} from "../store/app";
import NotFoundPage from "./NotFoundPage";

interface Props {
  filepath: string;
}

interface EnhanceProps extends Props {
  selectedPaths: Set<FilePath> | null;
  context: Context;
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme) => any;
}

export const ComponentPage = (props: EnhanceProps) => {
  const matchingSelectedPaths = ({path}: {path: string}) =>
    props.selectedPaths === null || props.selectedPaths.has(path);
  const components = props.context.components.filter(matchingSelectedPaths);
  const fileError = props.context.errors.filter(matchingSelectedPaths);
  const errors = fileError.length !== 0 ? fileError[0].errors : [];

  if (components.length === 0) {
    return <NotFoundPage filepath={props.filepath} />;
  }

  const component = components[0];

  return (
    <StyledPage>
      <StyledPageContents>
        <Toggle>
          <Readme />
        </Toggle>
        <Errors errors={errors} />
        <ComponentContainer
          component={component}
          themes={props.context.themes}
          styles={props.context.styles}
          selectedTheme={props.selectedTheme}
          setSelectedTheme={props.setSelectedTheme}
        />
      </StyledPageContents>
    </StyledPage>
  );
};

// @snoopy:ignore
export default connect(
  (state: State) => ({
    context: state.app.context,
    selectedPaths: state.app.selectedPaths,
    selectedTheme: state.app.selectedTheme,
  }),
  dispatch => ({
    setSelectedTheme: (theme: Theme) =>
      dispatch(actions.setSelectedTheme(theme)),
  }),
)(ComponentPage);
