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
    selected={[]}
  />
);

export const singleItem = () => (
  <ComponentTree
    components={[testComponents[0]]}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
singleItem.title = "Single Item";

export const singleItemWithSelection = () => (
  <ComponentTree
    components={[testComponents[0]]}
    selected={[testComponents[0].path]}
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
    selected={[]}
  />
);
multipleItems.title = "Multiple items";

export const multipleItemsWithSelection = () => (
  <ComponentTree
    components={testComponents}
    selected={[testComponents[0].path]}
    select={() => {
      alert("select");
    }}
  />
);
multipleItemsWithSelection.title = "Multiple items with selection";
