import { ID, Group, Node, isGroup } from "./tree"

export enum Orientation {
  LeftToRight, // Left branch is left of right branch
  TopToBottom, // Left branch is above right branch
  RightToLeft, // Left branch is right of right branch
  BottomToRight // Left branch is below the right branch
}

// Kept external to the tree structure
export interface LayoutProperties {
  ratio: number
  orientation: Orientation
}

export interface LayoutConfig {
  [key: string]: LayoutProperties
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function splitRect(
  { x, y, width, height }: Rect,
  props: LayoutProperties
): [Rect, Rect] {
  const width1 = Math.floor(width * props.ratio)
  const width2 = width - width1
  return [
    { x, y, width: width1, height },
    { x: x + width1, y, width: width2, height }
  ]
}

export interface WindowFrame {
  window: ID
  frame: Rect
}

function calculateWindowFrame(window: ID, frame: Rect): WindowFrame[] {
  return [{ window, frame }]
}

const defaultProps = {
  ratio: 0.5,
  orientation: Orientation.TopToBottom
}

function getLayoutProperties(
  id: string,
  layoutConfig?: LayoutConfig
): LayoutProperties {
  return (layoutConfig && layoutConfig[id]) || defaultProps
}

function calculateGroupFrames(
  group: Group,
  frame: Rect,
  layoutConfig?: LayoutConfig
): WindowFrame[] {
  const props = getLayoutProperties(group.id, layoutConfig)
  const [leftFrame, rightFrame] = splitRect(frame, props)

  return calculateFrames(group.left, leftFrame, layoutConfig).concat(
    calculateFrames(group.right, rightFrame)
  )
}

export function calculateFrames(
  node: Node | undefined,
  frame: Rect,
  layoutConfig?: LayoutConfig
): WindowFrame[] {
  if (!node) {
    return []
  }

  return isGroup(node)
    ? calculateGroupFrames(node, frame, layoutConfig)
    : calculateWindowFrame(node, frame)
}
