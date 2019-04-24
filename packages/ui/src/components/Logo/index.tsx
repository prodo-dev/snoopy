import * as React from "react";
import styled from "styled-components";

import logo from "../../media/logo_small.svg";
import {LogoWidth, margins} from "../../styles/theme";

const StyledLogo = styled.img`
  width: ${LogoWidth};
  margin: ${margins.small};
  vertical-align: middle;
  cursor: pointer;
`;

export default () => <StyledLogo src={logo} alt="" />;
