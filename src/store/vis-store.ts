import { observable, action, computed, toJS } from "mobx";
import jsonpath from "jsonpath";
import { FlattenedTreeNode, TreePath } from "../types/flattened-tree";
import {
  flattenTreeNode,
  getJsonNodeByPath,
  constructFlattenedTreeNode,
  findChildrenPostionRange,
  findNodePosition,
} from "../utils/tree-helpers";

const ROW_HEIGHT = 20;
const OVERFLOW_DISPLAY = 10;

export class VisStore {
  public jsonTree: any;
  @observable public viewportHeight: number;
  @observable public scrollPosition = 0;
  public readonly flattenedTree = observable.array<FlattenedTreeNode>([]);
  @observable public searchQuery = "";

  @observable public isLoading = false;
  @observable public isWrongFile = false;

  protected collapsedCache: { [key: string]: FlattenedTreeNode[] } = {};

  importJson = (jsonString: string): void => {
    this.flattenedTree.replace([]);
    this.searchQuery = "";

    this.isLoading = true;
    this.isWrongFile = false;
    setTimeout(() => {
      try {
        const json = JSON.parse(jsonString);
        this.jsonTree = json;

        const flat = flattenTreeNode(this.jsonTree);
        this.flattenedTree.replace(flat.length > 1 ? flat.slice(1) : flat);
      } catch (e) {
        this.isWrongFile = true;
        // console.error(e);
      }
      this.isLoading = false;
    });
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
      const removedItems = this.flattenedTree.splice(from, to - from, newNode);
      this.collapsedCache[jsonpath.stringify(node.path)] = toJS(removedItems);
    } else {
      const from = findNodePosition(this.flattenedTree, node);

      const pathString = jsonpath.stringify(node.path);
      const newNodes = this.collapsedCache[pathString] || [...flattenTreeNode(jsonElement, node.path)];
      delete this.collapsedCache[pathString];

      this.flattenedTree.splice(from, 1, ...newNodes);
    }
  };

  @action
  updateSearchQuery = (query: string): void => {
    this.searchQuery = query;
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

  @computed get matchingPaths(): TreePath[] {
    try {
      return this.searchQuery.length ? jsonpath.paths(this.jsonTree, this.searchQuery) : [];
    } catch (e) {
      return [];
    }
  }
}
