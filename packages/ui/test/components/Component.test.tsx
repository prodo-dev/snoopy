import "jest-dom/extend-expect"; // tslint:disable-line no-submodule-imports
import * as React from "react";
import {cleanup, render} from "react-testing-library";

import Component from "../../src/components/Component";
import {Component as ComponentModel} from "../../src/models";

afterEach(cleanup);

const TestComponent: ComponentModel = {
  name: "TestComponent",
  component: () => <div>test</div>,
};

test("displays a component", async () => {
  const {container} = render(<Component component={TestComponent} />);

  expect(container).toHaveTextContent("test");
});
