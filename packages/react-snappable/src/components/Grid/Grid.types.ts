import { Dimensions, Maybe, Point } from "../../types";

export interface GridContextPaneProps {
  index: number;
  position: Point;
  dimensions: Dimensions;
  node: HTMLElement;
  rect: DOMRect;
}

export interface GridContextSnappableProps extends Dimensions {
  index: number;
  node: HTMLElement;
  x: number;
  y: number;
}

export interface PaneInfo extends Omit<GridContextPaneProps, "index" | "rect"> {}

export interface GridContextProps {
  registerPane: (info: PaneInfo) => void;
  registerSnappable: (element: HTMLElement | null | undefined) => void;
  makeSnappable: (node: Maybe<HTMLElement>) => SnappableApi;
  grid: (grid: HTMLElement) => void;
}

export interface SnappableApi extends Point, Dimensions {
    onDrag: (point: Point) => void;
    onDragFinished: (point: Point) => void;
}

export interface GridProps {
  id: string;
  panes?: JSX.Element[];
}
