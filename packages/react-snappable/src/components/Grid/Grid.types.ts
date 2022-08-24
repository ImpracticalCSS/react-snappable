import { Dimensions, Point } from "../../types";

export interface GridContextPaneProps {
  index: number;
  position: Point;
  dimensions: Dimensions;
  node: HTMLElement;
}

export interface GridContextProps {
  panes: GridContextPaneProps[];
  registerPane: (info: Omit<GridContextPaneProps, "index">) => void;
  grid: (grid: Element) => void;
}

export interface GridProps {
  id: string;
}
