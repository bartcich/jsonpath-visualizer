import { observable, computed } from "mobx";
import { FlattenedTreeNode, TreePath } from "../types/flattened-tree";
import { isArray, isPrimitive } from "../utils";

const constructFlattenedTreeNode = (node: any, path: TreePath): FlattenedTreeNode => {
  const key = path[path.length - 1];

  // for array root (key is number) -> display nothing
  // for object root -> display key name
  // for primitive -> display `key: value`
  const displayValue = `${typeof key === "string" ? key : ""}${isPrimitive(node) ? `: ${"" + node}` : ""}`;
  return {
    path,
    displayValue,
    collapsible: !isPrimitive(node),
    collapsed: false,
  };
};

const flattenTreeNode = (node: any, path: TreePath = ["$"]): FlattenedTreeNode[] => {
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

export class VisStore {
  @observable public jsonTree: any;

  importJson = (jsonString: string): void => {
    try {
      const json = JSON.parse(jsonString);
      this.jsonTree = json;
    } catch (e) {
      console.error(e);
    }
  };

  @computed get flattenedTree(): FlattenedTreeNode[] {
    return this.jsonTree ? flattenTreeNode(this.jsonTree) : null;
  }
}
