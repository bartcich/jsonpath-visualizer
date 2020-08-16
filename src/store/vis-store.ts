import { observable, action, computed } from "mobx";
import { FlattenedTreeNode, TreePath } from "../types/flattened-tree";
import { isArray, isPrimitive } from "../utils";

const ROW_HEIGHT = 20;
const OVERFLOW_DISPLAY = 10;

const constructFlattenedTreeNode = (node: any, path: TreePath): FlattenedTreeNode => {
  const key = path[path.length - 1];

  const isInObject = typeof key === "string";

  // for array root (key is number) -> display nothing
  // for object root -> display key name
  // for primitive -> display `key: value`
  const displayValue = `${isInObject ? `${key}: ` : ""}${isPrimitive(node) ? node : ""}`;
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
  @observable public viewportHeight: number;
  @observable public scrollPosition = 0;

  importJson = (jsonString: string): void => {
    try {
      console.info("importing");
      const json = JSON.parse(jsonString);
      this.jsonTree = json;
      console.info("import done");
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

  @computed get flattenedTree(): FlattenedTreeNode[] {
    console.info("flattening");
    const result = this.jsonTree ? flattenTreeNode(this.jsonTree) : null;
    console.info("flattening done");
    return result;
  }
}
