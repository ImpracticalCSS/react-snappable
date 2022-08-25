export interface Point {
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface PointWithDimensions extends Point, Dimensions {
    
}

export type Maybe<T> = T | null | undefined;