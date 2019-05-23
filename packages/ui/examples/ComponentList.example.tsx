import * as React from "react";
import ComponentList from "../src/components/ComponentList";
import {testComponents} from "../test/fixtures";

export default ComponentList;

export const Empty = () => (
  <ComponentList
    components={[]}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);

export const singleItem = () => (
  <ComponentList
    components={[testComponents[0]]}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
singleItem.title = "Single Item";

export const singleItemWithSelection = () => (
  <ComponentList
    components={[testComponents[0]]}
    selected={[testComponents[0].path]}
    select={() => {
      alert("select");
    }}
  />
);
singleItemWithSelection.title = "Single item with selection";

export const multipleItems = () => (
  <ComponentList
    components={testComponents}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
multipleItems.title = "Multiple items";

export const multipleItemsWithSelection = () => (
  <ComponentList
    components={testComponents}
    selected={[testComponents[0].path]}
    select={() => {
      alert("select");
    }}
  />
);
multipleItemsWithSelection.title = "Multiple items with selection";
