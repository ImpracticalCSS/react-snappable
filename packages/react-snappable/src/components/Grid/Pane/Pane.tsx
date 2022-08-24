import React, { useCallback, useEffect, useRef } from "react";
import { PaneProps } from "./Pane.types";
import * as Styled from "./Pane.styled";
import { useGrid } from "../GridProvider";

const Pane = ({
  children,
  flex,
}: React.PropsWithChildren<PaneProps>): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);

  const grid = useGrid();

  const registerPane = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        grid.registerPane({
          position: { x: node.offsetLeft, y: node.offsetTop },
          dimensions: {
            width: node.clientWidth,
            height: node.clientHeight,
          },
          node: node,
        });
      }
    },
    [grid.registerPane]
  );

  useEffect(() => {
    registerPane(ref.current);
  }, []);

  useEffect(() => {});

  return (
    <Styled.Pane ref={ref} flex={flex}>
      {children}
    </Styled.Pane>
  );
};

export default Pane;
