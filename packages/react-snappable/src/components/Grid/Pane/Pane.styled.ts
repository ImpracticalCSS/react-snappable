import styled from "styled-components";
import { PaneStyledProps } from "./Pane.types";

export const Pane = styled.div<PaneStyledProps>`
    flex: ${({ flex = ".5 1 50%" }) => flex};
    background: red;
`;