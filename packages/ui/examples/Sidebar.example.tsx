import * as React from "react";
import Sidebar from "../src/components/Sidebar";
import {testComponents} from "../test/fixtures";

export default Sidebar;

export const openEmpty = () => (
  <Sidebar
    isOpen={true}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={[]}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
openEmpty.title = "Open empty";

export const closedEmpty = () => (
  <Sidebar
    isOpen={false}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={[]}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
closedEmpty.title = "Closed empty";

export const openWithComponents = () => (
  <Sidebar
    isOpen={true}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={testComponents}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
openWithComponents.title = "Open with components";

export const closedWithComponents = () => (
  <Sidebar
    isOpen={false}
    setSidebarOpen={() => alert("setSidebarOpen")}
    components={testComponents}
    select={() => {
      alert("select");
    }}
    selected={[]}
  />
);
closedWithComponents.title = "Closed with components";
