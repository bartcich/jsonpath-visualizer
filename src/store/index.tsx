import React from "react";
import { VisStore } from "./vis-store";

export const storeContext = React.createContext<VisStore | null>(null);

export const useStore = (): VisStore => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
