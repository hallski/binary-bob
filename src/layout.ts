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
  kind: "Window"
  id: ID
  rect: Rect
}

interface EmptyGroup {
  kind: "Empty"
  rect: Rect
}

interface MonocleGroup {
  kind: "Monocle"
  rect: Rect
  window: Window
}

interface BinaryGroup {
  kind: "Binary"
  left: Node
  right: Node
  rect: Rect
}

type Group = EmptyGroup | MonocleGroup | BinaryGroup

type Node = Window | Group

interface Layout {
  root: Group
}

export function create(rect: Rect): Layout {
  return { root: { kind: "Empty", rect } }
}

function createGroup(rect: Rect, left: Window, right: Window) {
  return { left, right, rect }
}

export function numberOfWindows(layout: Layout) {
  return layout.root ? 1 : 0
}

function addWindowToNode(node: Node, window: Window): Group {
  switch (node.kind) {
    case "Window":
      return { kind: "Binary", left: node, right: window, rect: zeroRect }
    default:
      return addWindowInGroup(node, window)
  }
}

function addWindowInGroup(group: Group, window: Window): Group {
  switch (group.kind) {
    case "Empty":
      return { kind: "Monocle", window, rect: group.rect }
    case "Monocle":
      return {
        kind: "Binary",
        left: group.window,
        right: window,
        rect: group.rect
      }
    case "Binary":
      return {
        kind: "Binary",
        left: group.left,
        right: addWindowToNode(group.right, window),
        rect: group.rect
      }
  }
}

export function addWindow(layout: Layout, id: ID): Layout {
  return {
    ...layout,
    root: addWindowInGroup(layout.root, {
      kind: "Window",
      id,
      rect: zeroRect
    })
  }
}

export function removeWindow(layout: Layout, window: ID): Layout {
  return create(zeroRect)
}

// Return a list of layout changes that should be applied
export function diff(layout1: Layout, layout2: Layout) {}

export function isWindow(node: Node): node is Window {
  return (<Window>node).kind === "Window"
}

export function isGroup(node: Node): node is Group {
  return !isWindow(node)
}
