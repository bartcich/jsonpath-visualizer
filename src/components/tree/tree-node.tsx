import React from "react";
import { observer } from "mobx-react-lite";
import cls from "classnames";
import { FlattenedTreeNode } from "../../types/flattened-tree";
import { useStore } from "../../store";
import { isPathDescendant } from "../../utils/tree-helpers";

const DEPTH_INDENT = 30;

interface TreeNodeProps {
  node: FlattenedTreeNode;
  position: number;
}

export const TreeNode: React.FC<TreeNodeProps> = observer((props) => {
  const { node, position } = props;

  const store = useStore();

  const { matchingPaths, toggleCollapse } = store;

  const depth = (node.path.length - 1) * DEPTH_INDENT;

  const handleCollapseTrigger = (): void => {
    toggleCollapse(node);
  };

  const matching = matchingPaths.some((tested) => isPathDescendant(tested, node.path));

  return (
    <div className={cls(`tree-node`, { matching })} style={{ top: position, marginLeft: depth }}>
      {node.collapsible && <span onClick={handleCollapseTrigger}>{node.collapsed ? "[] " : "[x] "}</span>}
      {node.displayValue}
    </div>
  );
});
