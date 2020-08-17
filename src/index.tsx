import React from "react";
import ReactDOM from "react-dom";
import "mobx-react-lite/batchingForReactDom";

import { VisStore } from "./store/vis-store";
import { storeContext } from "./store";
import { Visualizer } from "./components/Visualizer/visualizer";
import "./style.scss";

export const StoreProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const store = new VisStore();

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

const App = (
  <StoreProvider>
    <Visualizer />
  </StoreProvider>
);

ReactDOM.render(App, document.getElementById("app"));
