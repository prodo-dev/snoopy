import * as React from "react";
import ComponentTree from "../src/components/ComponentTree";
import {testComponents} from "../test/fixtures";

export default ComponentTree;

export const Empty = () => (
  <ComponentTree
    components={[]}
    select={() => {
      alert("select");
    }}
    selected={new Set()}
  />
);

export const singleItem = () => (
  <ComponentTree
    components={[testComponents[0]]}
    select={() => {
      alert("select");
    }}
    selected={new Set()}
  />
);
singleItem.title = "Single Item";

export const singleItemWithSelection = () => (
  <ComponentTree
    components={[testComponents[0]]}
    selected={new Set([testComponents[0].path])}
    select={() => {
      alert("select");
    }}
  />
);
singleItemWithSelection.title = "Single item with selection";

export const multipleItems = () => (
  <ComponentTree
    components={testComponents}
    select={() => {
      alert("select");
    }}
    selected={new Set()}
  />
);
multipleItems.title = "Multiple items";

export const multipleItemsWithSelection = () => (
  <ComponentTree
    components={testComponents}
    selected={new Set([testComponents[0].path])}
    select={() => {
      alert("select");
    }}
  />
);
multipleItemsWithSelection.title = "Multiple items with selection";
