import React from "react";
import { observer } from "mobx-react-lite";
import { Search } from "../search/search";
import { Tree } from "../tree/tree";

export const Visualizer: React.FC<{}> = observer(() => {
  return (
    <>
      <Search />
      <Tree />
    </>
  );
});
