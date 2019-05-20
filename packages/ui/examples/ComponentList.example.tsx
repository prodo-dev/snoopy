import * as React from "react";
import ComponentList from "../src/components/ComponentList";
import {testComponents} from "../test/fixtures";

export default ComponentList;

export const Empty = () => <ComponentList components={[]} />;

export const singleItem = () => (
  <ComponentList components={[testComponents[0]]} />
);
singleItem.title = "Single Item";

export const singleItemWithSelection = () => (
  <ComponentList
    components={[testComponents[0]]}
    selected={testComponents[0].path}
  />
);
singleItemWithSelection.title = "Single item with selection";

export const multipleItems = () => (
  <ComponentList components={testComponents} />
);
multipleItems.title = "Multiple items";

export const multipleItemsWithSelection = () => (
  <ComponentList
    components={testComponents}
    selected={testComponents[0].path}
  />
);
multipleItemsWithSelection.title = "Multiple items with selection";
