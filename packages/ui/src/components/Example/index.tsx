import * as React from "react";
import styled, {ThemeProvider} from "styled-components";
import backgroundImage from "../../media/transparent_background.png";
import {Example} from "../../models";
import {margins, paddings} from "../../styles";

interface Props {
  example: Example;
  userTheme?: any;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin: ${margins.none} ${margins.medium} ${margins.medium} ${margins.none};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const Container = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${backgroundImage}) repeat;
  padding: ${paddings.medium};
`;

const JsxContainer = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: repeat;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin-bottom: ${margins.small};
  color: ${props => props.theme.colors.text};
`;

export default (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    {props.userTheme ? (
      <ThemeProvider theme={props.userTheme}>
        <Container>
          <JsxContainer className="example-contents">
            {props.example.jsx}
          </JsxContainer>
        </Container>
      </ThemeProvider>
    ) : (
      <Container>
        <JsxContainer className="example-contents">
          {props.example.jsx}
        </JsxContainer>
      </Container>
    )}
  </StyledExample>
);
