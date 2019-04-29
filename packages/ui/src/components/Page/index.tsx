import styled from "styled-components";
import {margins, paddings} from "../../styles";

export const StyledPage = styled.div`
  padding: ${paddings.none};
  margin: ${margins.none};
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.bg};
`;

export const StyledPageContents = styled.div`
  padding: ${paddings.large};
  color: ${props => props.theme.colors.text};
`;
