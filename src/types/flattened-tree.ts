import { PathComponent } from "jsonpath";

export type TreePath = PathComponent[];

export interface FlattenedTreeNode {
  path: TreePath;
  displayValue: string;
  collapsible: boolean;
  collapsed: boolean;
}
