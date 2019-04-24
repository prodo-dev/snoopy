import * as React from "react";
import styled from "styled-components";
import ComponentList from "../components/ComponentList";
import {margins, paddings} from "../styles/theme";

const StyledPage = styled.div`
  padding: ${paddings.none};
  margin: ${margins.none};
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.text};
  padding: ${paddings.large};
`;

const HomePage = () => (
  <StyledPage>
    <h1>Snoopy</h1>
    <p>
      Add @prodo in the line above your exported components to see them with
      Snoopy.
    </p>
    <h2>Your components</h2>
    <ComponentList />
  </StyledPage>
);

export default HomePage;
