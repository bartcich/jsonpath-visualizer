import React from "react";
import { FlattenedTreeNode } from "../../types/flattened-tree";
import { useStore } from "../../store";

const DEPTH_INDENT = 30;

interface TreeNodeProps {
  node: FlattenedTreeNode;
  position: number;
}

export const TreeNode: React.FC<TreeNodeProps> = (props) => {
  const { node, position } = props;

  const store = useStore();

  const depth = (node.path.length - 1) * DEPTH_INDENT;

  const handleCollapseTrigger = (): void => {
    store.toggleCollapse(node);
  };

  return (
    <div className="tree-node" style={{ top: position, marginLeft: depth }}>
      {node.collapsible && <span onClick={handleCollapseTrigger}>{node.collapsed ? "[] " : "[x] "}</span>}
      {node.displayValue}
    </div>
  );
};
