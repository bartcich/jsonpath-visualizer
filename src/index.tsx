import React from "react";
import ReactDOM from "react-dom";
import "mobx-react-lite/batchingForReactDom";

import { VisStore } from "./store/vis-store";
import { storeContext } from "./store";
import { Tree } from "./components/tree/tree";

import "./style.scss";

import jsonFile from "../tools/output/100.json";

const testJson = jsonFile;

export const StoreProvider = ({ children }: { children: JSX.Element[] }): JSX.Element => {
  const store = new VisStore();

  setTimeout(() => {
    store.importJson(JSON.stringify(testJson));
  });

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

const App = (
  <StoreProvider>
    <div>here header</div>
    <Tree />
  </StoreProvider>
);

ReactDOM.render(App, document.getElementById("app"));
