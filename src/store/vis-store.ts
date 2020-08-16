import { observable, action, computed } from "mobx";
import jsonpath from "jsonpath";
import { FlattenedTreeNode, TreePath } from "../types/flattened-tree";
import { isArray, isPrimitive, isObject } from "../utils";

const ROW_HEIGHT = 20;
const OVERFLOW_DISPLAY = 10;

const nodeLabel = (node: any, path: TreePath, collapsed: boolean): string => {
  const key = path[path.length - 1];
  const isInObject = typeof key === "string";

  if (collapsed) {
    if (isArray(node)) {
      return `[Array(${node.length})]`;
    } else if (isObject(node)) {
      const objectKeys = Object.keys(node);
      if (objectKeys.length < 1) {
        return `{}`;
      }
      const firstKey = objectKeys[0];
      if (isPrimitive(node[firstKey])) {
        const hasMoreKeys = objectKeys.length > 1;
        return `{ ${firstKey}: ${node[firstKey]} ${hasMoreKeys ? ", ..." : ""}}`;
      }

      return `[Object]`;
    }
  } else {
    // for array root (key is number) -> display nothing
    // for object root -> display key name
    // for primitive -> display `key: value`
    return `${isInObject ? `${key}: ` : ""}${isPrimitive(node) ? node : ""}`;
  }
};

const constructFlattenedTreeNode = (node: any, path: TreePath, collapsed = false): FlattenedTreeNode => {
  const displayValue = nodeLabel(node, path, collapsed);
  return {
    path,
    displayValue,
    collapsible: !isPrimitive(node),
    collapsed,
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

const isPathDescendant = (parent: TreePath, obj: TreePath): boolean => {
  if (obj.length < parent.length) {
    return false;
  }

  return parent.every((v, i) => v === obj[i]);
};

const findNodePosition = (tree: FlattenedTreeNode[], node: FlattenedTreeNode): number => {
  return tree.indexOf(node);
};
const findChildrenPostionRange = (tree: FlattenedTreeNode[], node: FlattenedTreeNode): [number, number] => {
  const nodePosition = findNodePosition(tree, node);
  for (let i = nodePosition + 1; i < tree.length; i++) {
    if (!isPathDescendant(node.path, tree[i].path)) {
      return [nodePosition, i];
    }
  }

  return [nodePosition, tree.length];
};

const getJsonNodeByPath = (json: any, path: TreePath): any => {
  return jsonpath.query(json, jsonpath.stringify(path), 1)[0];
};

export class VisStore {
  public jsonTree: any;
  @observable public viewportHeight: number;
  @observable public scrollPosition = 0;
  public readonly flattenedTree = observable<FlattenedTreeNode>([]);

  importJson = (jsonString: string): void => {
    try {
      const json = JSON.parse(jsonString);
      this.jsonTree = json;

      this.flattenedTree.replace(flattenTreeNode(this.jsonTree));
    } catch (e) {
      console.error(e);
    }
  };

  @action
  setViewportHeight = (height: number): void => {
    this.viewportHeight = height;
  };

  @action
  setScrollPosition = (pos: number): void => {
    this.scrollPosition = pos;
  };

  @action
  toggleCollapse = (node: FlattenedTreeNode): void => {
    const jsonElement = getJsonNodeByPath(this.jsonTree, node.path);
    const newNode = constructFlattenedTreeNode(jsonElement, node.path, !node.collapsed);
    if (!node.collapsed) {
      const [from, to] = findChildrenPostionRange(this.flattenedTree, node);
      this.flattenedTree.splice(from, to - from, newNode);
    } else {
      const from = findNodePosition(this.flattenedTree, node);
      const newNodes = [...flattenTreeNode(jsonElement, node.path)];
      this.flattenedTree.splice(from, 1, ...newNodes);
    }
  };

  @computed get displayContainerHeight(): number {
    return this.flattenedTree.length * ROW_HEIGHT;
  }

  @computed get displayStartingIndex(): number {
    return this.scrollPosition / ROW_HEIGHT;
  }

  @computed get displayItemsCount(): number {
    return this.viewportHeight / ROW_HEIGHT + OVERFLOW_DISPLAY;
  }

  @computed get displayedTreePart(): FlattenedTreeNode[] {
    const displayTree = this.flattenedTree.slice(
      this.displayStartingIndex,
      this.displayStartingIndex + this.displayItemsCount,
    );
    return displayTree;
  }
}
