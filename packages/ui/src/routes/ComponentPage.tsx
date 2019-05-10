import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import {testComponents, testThemes} from "../../test/fixtures";
import Component from "../components/Component";
import {StyledPage} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar, {SidebarToggle} from "../components/Sidebar";
import {Component as ComponentModel, Context} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  path: string;
  components: ComponentModel[];
  errors: string[];
  context: Context;
}

const StyledComponentPage = styled.div`
  width: 100%;
  display: flex;
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const Components = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const Errors = styled.div``;

const ComponentContainer = styled.div`
  padding: ${paddings.medium} ${paddings.large};
`;

const StyledTitleContainer = styled.div`
  display: flex;
`;

const selectHeight = "38px";
const StyledTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.title};
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  line-height: ${selectHeight};
`;

const StyledSelect = styled(Select)`
  font-size: ${props => props.theme.fontSizes.normal}
  color: ${props => props.theme.colors.bg}
  width: 150px;
  margin-left: ${margins.large}
`;

const Divider = styled.div`
  margin: 0 ${margins.large};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderContainer = styled.div`
  padding: ${paddings.medium} ${paddings.large};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.fg};

  .sidebar-toggle {
    margin-left: 0;
  }
`;

const StyledError = styled.div`
  padding: ${paddings.large};
  color: ${props => props.theme.colors.error}
  background-color: ${props => props.theme.colors.errorBg};
  text-align: center;
`;

const ComponentPage = (props: Props) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const themes =
    props.context.themes && props.context.themes.filter(x => x != null);
  const options = themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });

  return (
    <StyledPage>
      <StyledComponentPage>
        <Sidebar
          selected={props.path}
          isOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          components={props.context.components.filter(
            (c: Component) => c != null,
          )}
        />

        <ContentContainer>
          <HeaderContainer>
            <NarrowScreen>
              <SidebarToggle
                isOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </NarrowScreen>
            {props.path}
          </HeaderContainer>

          <Errors className="errors">
            {props.errors.map((error, i) => (
              <StyledError key={i}>{error}</StyledError>
            ))}
          </Errors>
          <Components className="components">
            {props.components.map((component, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Divider />}
                <ComponentContainer key={component.name}>
                  <StyledTitleContainer>
                    <StyledTitle>{component.name}</StyledTitle>
                    {themes.length > 0 && (
                      <StyledSelect
                        defaultValue={options[selectedTheme]}
                        onChange={(selectedOption: any) =>
                          setSelectedTheme(selectedOption.value)
                        }
                        options={options}
                      />
                    )}
                  </StyledTitleContainer>
                  <Component
                    component={component}
                    userTheme={
                      themes.length > 0 &&
                      themes[selectedTheme] &&
                      themes[selectedTheme].theme
                    }
                  />
                </ComponentContainer>
              </React.Fragment>
            ))}
          </Components>
        </ContentContainer>
      </StyledComponentPage>
    </StyledPage>
  );
};

ComponentPage.examples = [
  {
    name: "No themes",
    jsx: (
      <ComponentPage
        context={{components: testComponents, themes: testThemes, errors: []}}
        path={testComponents[0].path}
        components={[testComponents[0]]}
        errors={[]}
      />
    ),
  },
  {
    name: "With themes",
    jsx: (
      <ComponentPage
        context={{components: testComponents, themes: testThemes, errors: []}}
        path={testComponents[0].path}
        components={[testComponents[0]]}
        errors={[]}
      />
    ),
  },
];

// @prodo
export default ComponentPage;
