import * as React from "react";
import Sidebar from "../src/components/Sidebar";
import {testComponents} from "../test/fixtures";

export default Sidebar;

export const openEmpty = () => (
  <Sidebar
    isOpen={true}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={[]}
  />
);
openEmpty.title = "Open empty";

export const closedEmpty = () => (
  <Sidebar
    isOpen={false}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={[]}
  />
);
closedEmpty.title = "Closed empty";

export const openWithComponents = () => (
  <Sidebar
    isOpen={true}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={testComponents}
  />
);
openWithComponents.title = "Open with components";

export const closedWithComponents = () => (
  <Sidebar
    isOpen={false}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={testComponents}
  />
);
closedWithComponents.title = "Closed with components";
