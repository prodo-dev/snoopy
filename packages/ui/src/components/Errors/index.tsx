import * as React from "react";
import styled from "styled-components";
import {paddings} from "../../styles";

const StyledError = styled.div`
  padding: ${paddings.large};
  color: ${props => props.theme.colors.error}
  background-color: ${props => props.theme.colors.errorBg};
  text-align: center;
`;

export const Errors = ({errors}: {errors: string[]}) => (
  <div className="errors">
    {errors.map((error, i) => (
      <StyledError key={i}>{error}</StyledError>
    ))}
  </div>
);
