import { PointWithDimensions } from "../types";

export function isAtRightEdge() {}

export function isPastRightEdge() {}

export function isAtLeftEdge() {}

export function isPastLeftEdge() {}

export function isWithinBoundingBox(point: PointWithDimensions, rect: DOMRect) {
  const { x, y, width, height } = point;

  return (
    rect.x <= x &&
    x <= rect.x + rect.width &&
    rect.y <= y &&
    y <= rect.y + rect.height
  );
}
