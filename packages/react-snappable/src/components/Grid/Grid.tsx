import React, { useEffect, useRef } from "react";
import { GridProps } from "./Grid.types";
import Pane from "./Pane";
import * as Styled from "./Grid.styled";
import GridProvider, { useGrid } from "./GridProvider";

const GridInner = ({
  id,
  children,
}: React.PropsWithChildren<GridProps>): JSX.Element => {
  const grid = useGrid();
  const ref = useRef<HTMLDivElement | null>(null);

  console.log(grid);

  useEffect(() => {
    if (ref.current) grid.grid(ref.current);
  }, []);

  return (
    <Styled.Grid
      ref={ref}
      id={id}
    >
      {children ? (
        children
      ) : (
        <>
          <Pane />
          <Pane />
        </>
      )}
    </Styled.Grid>
  );
};

const Grid = (props: React.PropsWithChildren<GridProps>): JSX.Element => {
  return (
    <GridProvider>
      <GridInner {...props} />
    </GridProvider>
  );
};

Grid.Pane = Pane;

export default Grid;
