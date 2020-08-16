import jsonpath from "jsonpath";

import { isArray, isObject, isPrimitive } from "./type-checks";
import { TreePath, FlattenedTreeNode } from "../types/flattened-tree";

export const simplifiedChildLabel = (node: any): string => {
  if (isArray(node)) {
    return "Array";
  }
  if (isObject(node)) {
    return "Object";
  }
  return node;
};

export const nodeLabel = (node: any, path: TreePath, collapsed: boolean): string => {
  const key = path[path.length - 1];
  const isInObject = typeof key === "string";

  if (collapsed) {
    if (isArray(node)) {
      if (node.length < 1) {
        return "[]";
      }
      const firstChild = node[0];
      const hasMoreChildren = node.length > 1;
      return `[ ${simplifiedChildLabel(firstChild)}${hasMoreChildren ? ", ..." : ""}]`;
    } else if (isObject(node)) {
      const objectKeys = Object.keys(node);
      if (objectKeys.length < 1) {
        return `{}`;
      }
      const firstKey = objectKeys[0];
      const hasMoreKeys = objectKeys.length > 1;
      return `{ ${firstKey}: ${simplifiedChildLabel(node[firstKey])}${hasMoreKeys ? ", ..." : ""}}`;
    }
  } else {
    // for array root (key is number) -> display nothing
    // for object root -> display key name
    // for primitive -> display `key: value`
    return `${isInObject ? `${key}: ` : ""}${isPrimitive(node) ? node : ""}`;
  }
};

export const constructFlattenedTreeNode = (node: any, path: TreePath, collapsed = false): FlattenedTreeNode => {
  const displayValue = nodeLabel(node, path, collapsed);
  return {
    path,
    displayValue,
    collapsible: !isPrimitive(node),
    collapsed,
  };
};

export const flattenTreeNode = (node: any, path: TreePath = ["$"]): FlattenedTreeNode[] => {
  if (isArray(node)) {
    const arrrayFlattenedNode = constructFlattenedTreeNode(node, path);
    const children = node
      .map((n, i) => flattenTreeNode(n, [...path, i]))
      .reduce((prev, curr) => [...prev, ...curr], []);
    return [arrrayFlattenedNode, ...children];
  } else if (isPrimitive(node)) {
    return [constructFlattenedTreeNode(node, path)];
  } else {
    const objFlattenedNode = constructFlattenedTreeNode(node, path);
    const children = Object.keys(node)
      .map((key) => {
        return flattenTreeNode(node[key], [...path, key]);
      })
      .reduce<FlattenedTreeNode[]>((prev, curr) => [...prev, ...curr], []);

    return [objFlattenedNode, ...children];
  }
};

export const isPathDescendant = (parent: TreePath, obj: TreePath): boolean => {
  if (obj.length < parent.length) {
    return false;
  }

  return parent.every((v, i) => v === obj[i]);
};

export const findNodePosition = (tree: FlattenedTreeNode[], node: FlattenedTreeNode): number => {
  return tree.indexOf(node);
};

export const findChildrenPostionRange = (tree: FlattenedTreeNode[], node: FlattenedTreeNode): [number, number] => {
  const nodePosition = findNodePosition(tree, node);
  for (let i = nodePosition + 1; i < tree.length; i++) {
    if (!isPathDescendant(node.path, tree[i].path)) {
      return [nodePosition, i];
    }
  }

  return [nodePosition, tree.length];
};

export const getJsonNodeByPath = (json: any, path: TreePath): any => {
  return jsonpath.query(json, jsonpath.stringify(path), 1)[0];
};
