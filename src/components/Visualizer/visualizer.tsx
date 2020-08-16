import React from "react";
import { observer } from "mobx-react-lite";
import { Search } from "../search/search";
import { Tree } from "../tree/tree";
import { FileInput } from "../file-input/file-input";

export const Visualizer: React.FC<{}> = observer(() => {
  return (
    <>
      <FileInput />
      <Search />
      <Tree />
    </>
  );
});
