import { ID, Layout } from "./tree"

enum Orientation {
  LeftToRight, // Left branch is left of right branch
  TopToBottom, // Left branch is above right branch
  RightToLeft, // Left branch is right of right branch
  BottomToRight // Left branch is below the right branch
}

// Kept external to the tree structure
interface GroupLayoutProperties {
  ratio: number
  orientation: Orientation
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function splitRect({ x, y, width, height }: Rect, ratio: number): [Rect, Rect] {
  const width1 = width * ratio
  const width2 = width * (1 - ratio)
  return [
    { x, y, width: width1, height },
    { x: x + width1, y, width: width2, height }
  ]
}

export interface WindowFrame {
  window: ID
  frame: Rect
}

function calculateWindowFrame(frame: Rect): WindowFrame[] {
  return [{ window: this.id, frame }]
}

function calculateGroupFrames(frame: Rect): WindowFrame[] {
  if (!this.right) {
    return this.left.calculateFrames(frame)
  }

  const [leftFrame, rightFrame] = splitRect(frame, 0.5)
  return this.left
    .calculateFrames(leftFrame)
    .concat(this.right.calculateFrames(rightFrame))
}

function calculateRootFrames(frame: Rect): WindowFrame[] {
  if (this.child) {
    // Monocle Layout
    return this.child.calculateFrames(frame)
  }

  return []
}

export function calculateFrames(layout: Layout, frame: Rect): WindowFrame[] {
  return layout.root.calculateFrames(frame)
}
