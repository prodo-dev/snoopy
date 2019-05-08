import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import Component from "../components/Component";
import {StyledPage} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar, {SidebarToggle} from "../components/Sidebar";
import {Component as ComponentModel, Context} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  path: string;
  components: ComponentModel[];
  context: Context;
}

const StyledComponentPage = styled.div`
  width: 100%;
  display: flex;
`;

const Components = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

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

const ComponentPage = (props: Props) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const options = props.context.themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });

  return (
    <StyledPage>
      <StyledComponentPage>
        <Sidebar
          selected={props.path}
          isOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          components={props.context.components}
        />
        <Components>
          {props.components.map((component, i) => (
            <React.Fragment>
              {i > 0 && <Divider />}
              <ComponentContainer key={component.name}>
                <StyledTitleContainer>
                  <NarrowScreen>
                    <SidebarToggle
                      isOpen={isSidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </NarrowScreen>
                  <StyledTitle>{component.name}</StyledTitle>
                  {props.context.themes.length > 0 && (
                    <StyledSelect
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
                    props.context.themes.length > 0 &&
                    props.context.themes[selectedTheme].theme
                  }
                />
              </ComponentContainer>
            </React.Fragment>
          ))}
        </Components>
      </StyledComponentPage>
    </StyledPage>
  );
};

export default ComponentPage;
