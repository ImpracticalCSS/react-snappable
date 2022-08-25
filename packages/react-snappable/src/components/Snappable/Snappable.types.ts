import React from "react";
import { Point } from "../../types";

export interface SnappableProps {
    initialPosition?: Point;
    style?: React.CSSProperties;
    className?: string;
}