import { ID, Group, Node, Window, isGroup } from "./tree"

enum Orientation {
  LeftToRight, // Left branch is left of right branch
  TopToBottom, // Left branch is above right branch
  RightToLeft, // Left branch is right of right branch
  BottomToRight // Left branch is below the right branch
}

// Kept external to the tree structure
interface LayoutProperties {
  ratio: number
  orientation: Orientation
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

function calculateWindowFrame(window: Window, frame: Rect): WindowFrame[] {
  return [{ window: window.id, frame }]
}

function getLayoutProperties(id: string): LayoutProperties {
  return {
    ratio: 0.5,
    orientation: Orientation.TopToBottom
  }
}

function calculateGroupFrames(group: Group, frame: Rect): WindowFrame[] {
  const props = getLayoutProperties(group.id)
  const [leftFrame, rightFrame] = splitRect(frame, props)
  return calculateFrames(group.left, leftFrame).concat(
    calculateFrames(group.right, rightFrame)
  )
}

export function calculateFrames(
  node: Node | undefined,
  frame: Rect
): WindowFrame[] {
  if (!node) {
    return []
  }

  return isGroup(node)
    ? calculateGroupFrames(node, frame)
    : calculateWindowFrame(node, frame)
}
