import React from "react";
import { FlattenedTreeNode } from "../../types/flattened-tree";

const DEPTH_INDENT = 30;

interface TreeNodeProps {
  node: FlattenedTreeNode;
  position: number;
}

export const TreeNode: React.FC<TreeNodeProps> = (props) => {
  const { node, position } = props;

  const depth = (node.path.length - 1) * DEPTH_INDENT;

  return (
    <div className="tree-node" style={{ top: position, marginLeft: depth }}>
      {node.displayValue}
    </div>
  );
};
