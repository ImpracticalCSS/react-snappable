import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ExtendedMap from "../../classes/ExtendedMap";
import { Dimensions, Maybe, Point } from "../../types";
import { isWithinBoundingBox } from "../../utils/grid";
import {
  GridContextPaneProps,
  GridContextProps,
  GridContextSnappableProps,
  PaneInfo,
  SnappableApi,
} from "./Grid.types";

class PanesMap extends ExtendedMap<HTMLElement, GridContextPaneProps> {}
class SnappablesMap extends ExtendedMap<HTMLElement, GridContextSnappableProps> {}

const warnReRegisteringPane = (info: PaneInfo) =>
  console.warn(
    "You are attempting to register a pane more than once. Ensure that `registerPane` is only called once.",
    info
  );

const GridContext =
  React.createContext<GridContextProps | undefined>(undefined);


const GridProvider = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element => {
  const [panes, setPanes] = useState<PanesMap>(new PanesMap());

  const [snappables, setSnappables] = useState<SnappablesMap>(
    new SnappablesMap()
  );

  const [grid, setGrid] = useState<HTMLElement | null>(null);

  const registerSnappable = useCallback(
    (element: HTMLElement | undefined | null) => {
      setSnappables((prevSnappables) => {
        if (!element || prevSnappables.has(element)) {
          return prevSnappables;
        }

        const { x, y, width, height } = element.getBoundingClientRect();

        return new SnappablesMap(
          prevSnappables.set(element, {
            index: prevSnappables.size,
            node: element,
            x,
            y,
            width,
            height,
          })
        );
      });
    },
    []
  );

  const moveSnappable = useCallback((point: Point, element: HTMLElement) => {
    setSnappables((prevSnappables) => {
      const prevSnappable = prevSnappables.get(element);

      if (!prevSnappable) {
        return prevSnappables;
      }

      return new SnappablesMap(
        prevSnappables.set(element, {
          ...prevSnappable,
          ...point,
        })
      );
    });
  }, []);

  const resizeSnappable = useCallback(
    (dimensions: Dimensions, element: HTMLElement) => {
      setSnappables((prevSnappables) => {
        const prevSnappable = prevSnappables.get(element);

        if (!prevSnappable) {
          return prevSnappables;
        }

        return new SnappablesMap(
          prevSnappables.set(element, {
            ...prevSnappable,
            ...dimensions,
          })
        );
      });
    },
    []
  );

  const registerPane = useCallback((info: PaneInfo) => {
    setPanes((prevPanes) => {
      const { node } = info;

      if (prevPanes.find((pane) => pane.node === node)) {
        warnReRegisteringPane(info);
        return prevPanes;
      }

      return new PanesMap(
        prevPanes.set(node, {
          index: prevPanes.size,
          rect: node.getBoundingClientRect(),
          ...info,
        })
      );
    });
  }, []);

  const updatePanes = useCallback(() => {
    setPanes((prevPanes) => {
      const nextPanes = new PanesMap();

      prevPanes.forEach((pane, key) => {
        const { node, index } = pane;

        nextPanes.set(key, {
          node,
          index,
          position: { x: node.offsetLeft, y: node.offsetTop },
          dimensions: {
            width: node.clientWidth,
            height: node.clientHeight,
          },
          rect: node.getBoundingClientRect(),
        });
      });

      return nextPanes;
    });
  }, []);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver(() => {
      updatePanes();
    });
  }, []);

  const makeSnappableDragHandler = useCallback(
    (node: Maybe<HTMLElement>) => {
      return (point: Point) => {
        if (grid && node) {
          moveSnappable(point, node);

          const { width, height } = node.getBoundingClientRect();

          const pane = panes.find((pane) => {
            const rect = pane.node.getBoundingClientRect();

            return isWithinBoundingBox({ ...point, width, height }, rect);
          });

          if (pane) {
          }
        }
      };
    },
    [grid, panes]
  );

  const makeSnappableDragFinishedHandler = useCallback(
    (node: Maybe<HTMLElement>) => {
      return (point: Point) => {
        if (node) {
          moveSnappable(point, node);

          const snappableNode = node.getBoundingClientRect();

          const pane = panes.find((pane) => {
            const rect = pane.node.getBoundingClientRect();

            return isWithinBoundingBox(snappableNode, rect);
          });

          if (pane) {
            const { width, height, x, y } = pane.node.getBoundingClientRect();

            moveSnappable({ x, y }, node);
            resizeSnappable({ width, height }, node);
          }
        }
      };
    },
    [grid, panes]
  );

  const makeSnappable = useCallback(
    (node: Maybe<HTMLElement>): SnappableApi => {
      const snappable = node ? snappables.get(node) : null;

      return {
        onDrag: makeSnappableDragHandler(node),
        onDragFinished: makeSnappableDragFinishedHandler(node),
        x: snappable?.x ?? 0,
        y: snappable?.y ?? 0,
        width: snappable?.width ?? 0,
        height: snappable?.height ?? 0,
      };
    },
    [makeSnappableDragHandler, makeSnappableDragFinishedHandler, snappables]
  );

  const observeGrid = useCallback((element: HTMLElement) => {
    setGrid(element);
    resizeObserver.observe(element);
  }, []);

  const value = useMemo<GridContextProps>(
    () => ({
      registerPane,
      registerSnappable,
      grid: observeGrid,
      makeSnappable,
    }),
    [registerPane, registerSnappable, observeGrid, makeSnappable]
  );

  useEffect(() => {
    return function cleanupGridProvider() {
      resizeObserver.disconnect();
    };
  }, []);

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

export function useGrid() {
  const context = useContext(GridContext);

  if (context === undefined) {
    throw new Error("`useGrid` must be used within a <Grid />");
  }

  return context;
}

export function useSnappable(
  ref: React.MutableRefObject<HTMLElement | null>
): SnappableApi {
  const grid = useGrid();

  useEffect(() => {
    grid.registerSnappable(ref.current);
  }, []);

  return grid.makeSnappable(ref.current);
}

export default GridProvider;
