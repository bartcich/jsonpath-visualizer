import React from "react";
import ReactDOM from "react-dom";
import "mobx-react-lite/batchingForReactDom";

import { VisStore } from "./store/vis-store";
import { storeContext } from "./store";

import "./style.scss";
import { Tree } from "./components/tree/tree";

const testJson = {
  firstName: "John",
  lastName: "doe",
  age: 26,
  address: {
    streetAddress: "naist street",
    city: "Nara",
    postalCode: "630-0192",
  },
  phoneNumbers: [
    {
      type: "iPhone",
      number: "0123-4567-8888",
    },
    {
      type: "home",
      number: "0123-4567-8910",
    },
  ],
};

export const StoreProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const store = new VisStore();

  store.importJson(JSON.stringify(testJson));

  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

const App = (
  <StoreProvider>
    <Tree />
  </StoreProvider>
);

ReactDOM.render(App, document.getElementById("app"));
