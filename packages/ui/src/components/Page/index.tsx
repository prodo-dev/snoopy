import styled from "styled-components";
import {margins, paddings} from "../../styles";

export const StyledPage = styled.div`
  padding: ${paddings.none};
  margin: ${margins.none};
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: ${props => props.theme.colors.bg};
`;

export const StyledPageContents = styled.div`
  padding: ${paddings.large};
  flex-grow: 1;
  color: ${props => props.theme.colors.text};
`;
