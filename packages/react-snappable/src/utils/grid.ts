import { PointWithDimensions } from "../types";

export function isPastEdge(point: PointWithDimensions, rect: DOMRect) {
    console.log(point, rect);
    if (point.x < rect.x) return true;
    return false;
}

export function isWithinBoundingBox(point: PointWithDimensions, rect: DOMRect) {
  const { x, y } = point;

  return (
    rect.x <= x &&
    x <= rect.x + rect.width &&
    rect.y <= y &&
    y <= rect.y + rect.height
  );
}
