import "jest-dom/extend-expect"; // tslint:disable-line no-submodule-imports
import * as React from "react";
import {cleanup, render} from "react-testing-library";

import Component from "../../src/components/Component";

afterEach(cleanup);

const TestComponent = () => <div>test</div>;

test("displays a component", async () => {
  const {container} = render(<Component component={TestComponent} />);

  expect(container).toHaveTextContent("test");
});
