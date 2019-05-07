import "jest-dom/extend-expect"; // tslint:disable-line no-submodule-imports
import * as React from "react";
import {
  cleanup,
  render as renderRaw,
  waitForDomChange,
} from "react-testing-library";

import {ThemeProvider} from "styled-components";
import Component from "../../src/components/Component";
import {
  Component as ComponentModel,
  Example as ExampleModel,
} from "../../src/models";
import {darkTheme} from "../../src/styles/theme";

afterEach(cleanup);

const render = (component: React.ReactElement) =>
  renderRaw(<ThemeProvider theme={darkTheme}>{component}</ThemeProvider>);

const TestComponent: React.ComponentType<any> & {examples?: ExampleModel[]} = ({
  name,
}: {
  name?: string;
}) => <div>hello {name || "you"}</div>;

const Test: ComponentModel = {
  name: "TestComponent",
  component: TestComponent,
};

test("renders component with no examples", async () => {
  const {container} = render(<Component component={Test} />);
  await waitForDomChange({container});

  expect(container.querySelector(".example-title")).toHaveTextContent(
    "Default",
  );
  expect(container).toHaveTextContent("hello you");
});

test("renders component with single example", async () => {
  TestComponent.examples = [
    {name: "Example 1", jsx: <TestComponent name="Tom" />},
  ];

  const {container} = render(<Component component={Test} />);
  await waitForDomChange({container});

  expect(container.querySelector(".example-title")).toHaveTextContent(
    "Example 1",
  );
  expect(container).toHaveTextContent("hello Tom");
});

test("renders component with multiple examples", async () => {
  TestComponent.examples = [
    {name: "Example 1", jsx: <TestComponent name="Tom" />},
    {name: "Example 2", jsx: <TestComponent name="Andreja" />},
  ];

  const {container} = render(<Component component={Test} />);
  await waitForDomChange({container});

  expect(container.querySelector(".example-title")).toHaveTextContent(
    "Example 1",
  );
  expect(container).toHaveTextContent("hello Tom");

  expect(container.querySelectorAll(".example-title")[1]).toHaveTextContent(
    "Example 2",
  );
  expect(container).toHaveTextContent("hello Andreja");
});
