import * as React from "react";
import styled from "styled-components";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Context} from "../models";

interface Props {
  filepath: string;
  context: Context;
}

const StyledPath = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const NotFoundPage = (props: Props) => (
  <StyledPage>
    <StyledPageContents>
      <h2>
        Path <StyledPath>{props.filepath}</StyledPath> does not exist.
      </h2>
      <h4>Please choose a component from the sidebar.</h4>
    </StyledPageContents>
  </StyledPage>
);

export default NotFoundPage;
