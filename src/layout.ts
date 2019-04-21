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

function createEmptyGroup(rect: Rect): Group {
  return {
    kind: "Empty",
    rect
  }
}

function createMonocleGroup(windowID: ID, rect: Rect): Group {
  return {
    kind: "Monocle",
    window: createWindow(windowID, rect),
    rect
  }
}
function createBinaryGroup(left: Node, right: Node, rect: Rect): Group {
  return {
    kind: "Binary",
    left,
    right,
    rect
  }
}

function createWindow(id: ID, rect: Rect): Window {
  return {
    kind: "Window",
    id,
    rect
  }
}

function addWindowToNode(node: Node, windowID: ID): Group {
  switch (node.kind) {
    case "Window":
      return createBinaryGroup(node, createWindow(windowID, zeroRect), zeroRect)
    default:
      return addWindowInGroup(node, windowID)
  }
}

function addWindowInGroup(group: Group, windowID: ID): Group {
  switch (group.kind) {
    case "Empty":
      return createMonocleGroup(windowID, group.rect)
    case "Monocle":
      return createBinaryGroup(
        group.window,
        createWindow(windowID, group.rect),
        group.rect
      )
    case "Binary":
      return createBinaryGroup(
        group.left,
        addWindowToNode(group.right, windowID),
        group.rect
      )
  }
}

export function addWindow(layout: Layout, id: ID): Layout {
  return {
    ...layout,
    root: addWindowInGroup(layout.root, id)
  }
}

export function removeWindow(layout: Layout, window: ID): Layout {
  return create(layout.root.rect)
}

// Return a list of layout changes that should be applied
export function diff(layout1: Layout, layout2: Layout) {}

export function isWindow(node: Node): node is Window {
  return (<Window>node).kind === "Window"
}

export function isGroup(node: Node): node is Group {
  return !isWindow(node)
}
