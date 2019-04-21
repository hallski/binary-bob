interface Rect {
  x: number
  y: number
  width: number
  height: number
}
export const zeroRect: Rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

interface Window {
  wmWindow: any
}

interface Group {
  left: Node
  right: Node
  rect: Rect
}

type Node = Window | Group

interface Layout {
  root: Node | undefined
  rect: Rect
}

export function create(rect: Rect): Layout {
  return { root: undefined, rect }
}
