import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GridContextPaneProps, GridContextProps } from "./Grid.types";

const warnReRegisteringPane = (info: Omit<GridContextPaneProps, "index">) =>
  console.warn(
    "You are attempting to register a pane more than once. Ensure that `registerPane` is only called once.",
    info
  );

const GridContext =
  React.createContext<GridContextProps | undefined>(undefined);

const GridProvider = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element => {
  const [panes, setPanes] = useState<GridContextPaneProps[]>([]);

  const registerPane = useCallback(
    (info: Omit<GridContextPaneProps, "index">) => {
      setPanes((prevPanes) => {
        const { node } = info;

        if (prevPanes.findIndex((pane) => pane.node === node) > -1) {
          warnReRegisteringPane(info);
          return prevPanes;
        }

        const nextPanes = [...prevPanes];
        const index = prevPanes.length;

        nextPanes.push({
          index,
          ...info,
        });

        return nextPanes;
      });
    },
    []
  );

  const updatePanes = useCallback(() => {
    setPanes((prevPanes) => {
      return prevPanes.map((pane) => {
        const { node, index } = pane;

        return {
          node,
          index,
          position: { x: node.offsetLeft, y: node.offsetTop },
          dimensions: {
            width: node.clientWidth,
            height: node.clientHeight,
          },
        };
      }, []);
    });
  }, []);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver(() => {
      updatePanes();
    });
  }, []);

  const observeGrid = useCallback((element: Element) => {
    resizeObserver.observe(element);
  }, []);

  const value = useMemo<GridContextProps>(
    () => ({
      panes,
      registerPane,
      grid: observeGrid,
    }),
    [panes, registerPane, observeGrid]
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
    throw new Error("");
  }

  return context;
}

export default GridProvider;
