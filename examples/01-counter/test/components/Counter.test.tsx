import "jest-dom/extend-expect"; // tslint:disable-line no-submodule-imports
import * as React from "react";
import {cleanup, render} from "react-testing-library";

import Counter from "../../src/components/Counter";

afterEach(cleanup);

test("displays a counter", async () => {
  const {container} = render(<Counter count={5} />);

  expect(container).toHaveTextContent("5");
});
