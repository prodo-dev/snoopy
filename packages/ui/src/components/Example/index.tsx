import * as React from "react";
import styled from "styled-components";
import {Example} from "../../models";

interface Props {
  example: Example;
}

const StyledExample = styled.div``;

export default (props: Props) => (
  <StyledExample>
    <h2>{props.example.name}</h2>
    {props.example.jsx}
  </StyledExample>
);
