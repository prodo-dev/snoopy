import * as React from "react";
import {Link} from "../components/Link";
import {StyledPage, StyledPageContents} from "../components/Page";

const NotFoundPage = () => (
  <StyledPage>
    <StyledPageContents>
      <h2>This page does not exist.</h2>
      <Link to="/">Head home.</Link>
    </StyledPageContents>
  </StyledPage>
);

export default NotFoundPage;
