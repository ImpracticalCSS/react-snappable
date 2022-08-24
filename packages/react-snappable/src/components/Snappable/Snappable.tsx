import React from "react";
import { SnappableProps } from "./Snappable.types";
import Draggable from 'react-draggable';

const Snappable = ({ children, initialPosition }: React.PropsWithChildren<SnappableProps>): JSX.Element => {
    return (
        <Draggable defaultPosition={initialPosition}>
            {children}
        </Draggable>
    );
}

export default Snappable;
