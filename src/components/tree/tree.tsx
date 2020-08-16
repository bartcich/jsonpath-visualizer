import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { TreeNode } from "./tree-node";

const ROW_HEIGHT = 20;

export const Tree: React.FC<{}> = observer(() => {
  const store = useStore();

  const displayTree = store.flattenedTree.slice();
  return (
    <div>
      {displayTree.map((n, i) => (
        <TreeNode key={i} node={n} position={i * ROW_HEIGHT} />
      ))}
    </div>
  );
});
