import "jest-dom/extend-expect"; // tslint:disable-line no-submodule-imports
import * as React from "react";
import {cleanup, render} from "react-testing-library";

import Component from "../../src/components/Component";
import {Component as ComponentModel} from "../../src/models";

afterEach(cleanup);

const TestComponent = ({name}: {name: string}) => <div>{name}</div>;

TestComponent.examples = [
  {name: "Example 1", jsx: <TestComponent name="Tom" />},
];

const Test: ComponentModel = {
  name: "TestComponent",
  component: TestComponent,
};

test("displays a component", async () => {
  const {container} = render(<Component component={Test} />);

  expect(container.querySelector("h2")).toHaveTextContent("Example 1");
  expect(container).toHaveTextContent("Tom");
});
