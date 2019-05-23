import * as React from "react";
import styled from "styled-components";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Component as ComponentModel, Context} from "../models";
import {margins} from "../styles";

interface Props {
  components: ComponentModel[];
  errors: string[];
  context: Context;
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

const HomePage = ({context, components, errors}: Props) => {
  const hasComponents = context.components.length > 0;

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

export default HomePage;
