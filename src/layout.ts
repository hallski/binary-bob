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

type ID = number

interface Window {
  id: ID
  rect: Rect
}

interface Group {
  id: ID
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

export function addWindow(layout: Layout, id: ID): Layout {
  return { ...layout, root: { id, rect: zeroRect } }
}

export function removeWindow(layout: Layout, window: ID): Layout {
  return create(zeroRect)
}

// Return a list of layout changes that should be applied
export function diff(layout1: Layout, layout2: Layout) {}
