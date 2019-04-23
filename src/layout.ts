type ID = number

interface Window {
  kind: "Window"
  id: ID
}

interface EmptyGroup {
  kind: "Empty"
}

interface MonocleGroup {
  kind: "Monocle"
  window: Window
}

interface BinaryGroup {
  kind: "Binary"
  left: Node
  right: Node
}

type Group = EmptyGroup | MonocleGroup | BinaryGroup

type Node = Window | Group

interface Layout {
  root: Group
}

export function create(): Layout {
  return { root: createEmptyGroup() }
}

function createEmptyGroup(): Group {
  return {
    kind: "Empty"
  }
}

function createMonocleGroup(windowID: ID): Group {
  return {
    kind: "Monocle",
    window: createWindow(windowID)
  }
}
function createBinaryGroup(left: Node, right: Node): Group {
  return {
    kind: "Binary",
    left,
    right
  }
}

function createWindow(id: ID): Window {
  return {
    kind: "Window",
    id
  }
}

function addWindowToNode(node: Node, windowID: ID): Group {
  switch (node.kind) {
    case "Window":
      return createBinaryGroup(node, createWindow(windowID))
    default:
      return addWindowInGroup(node, windowID)
  }
}

function addWindowInGroup(group: Group, windowID: ID): Group {
  switch (group.kind) {
    case "Empty":
      return createMonocleGroup(windowID)
    case "Monocle":
      return createBinaryGroup(group.window, createWindow(windowID))
    case "Binary":
      return createBinaryGroup(
        group.left,
        addWindowToNode(group.right, windowID)
      )
  }
}

function removeWindowFromGroup(group: Group, windowID: ID): Group {
  switch (group.kind) {
    case "Empty":
      return group // Window ID does not exist
    case "Monocle":
      if (group.window.id === windowID) {
        return createEmptyGroup()
      } else {
        return group // Window ID does not exist
      }
    case "Binary":
      if (group.left.kind === "Window" && group.left.id === windowID) {
        if (group.right.kind === "Window") {
          return createMonocleGroup(group.right.id)
        } else {
          return group.right
        }
      } else if (group.right.kind === "Window" && group.right.id === windowID) {
        if (group.left.kind === "Window") {
          return createMonocleGroup(group.left.id)
        } else {
          return group.left
        }
      } else {
        return group // TODO: Need to handle other cases here
      }
  }
}

export function addWindow(layout: Layout, id: ID): Layout {
  return {
    ...layout,
    root: addWindowInGroup(layout.root, id)
  }
}

export function removeWindow(layout: Layout, windowID: ID): Layout {
  return {
    ...layout,
    root: removeWindowFromGroup(layout.root, windowID)
  }
}

// Return a list of layout changes that should be applied
//export function diff(layout1: Layout, layout2: Layout) {}

export function isWindow(node: Node): node is Window {
  return (node as Window).kind === "Window"
}

export function isGroup(node: Node): node is Group {
  return !isWindow(node)
}
