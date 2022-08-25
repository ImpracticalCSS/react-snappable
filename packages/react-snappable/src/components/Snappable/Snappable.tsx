import React, { useCallback, useRef } from "react";
import { SnappableProps } from "./Snappable.types";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useSnappable } from "../Grid";

const Snappable = ({
  children,
  initialPosition,
  style: passthroughStyle,
  className,
}: React.PropsWithChildren<SnappableProps>): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { onDrag, onDragFinished, x, y, width, height } = useSnappable(ref);

  const handleDrag = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      onDrag(data);
    },
    [onDrag]
  );

  const handleDragStart = useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      onDragFinished(data);
    },
    [onDrag]
  );

  const style = {
    ...passthroughStyle,
    ...(width && height
      ? { width, height, display: "flex" }
      : { display: "flex" }),
  };

  return (
    <Draggable
      defaultPosition={initialPosition}
      onDrag={handleDrag}
      onStop={handleDragStart}
      position={{ x, y }}
    >
      <div className={className} ref={ref} style={style}>
        {children}
      </div>
    </Draggable>
  );
};

export default Snappable;
