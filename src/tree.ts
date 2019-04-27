import { generateUUID } from "./utils"

export type ID = string

export interface Window {
  id: string
}

export interface Group {
  id: string
  left: Node
  right: Node
}

export type Node = Window | Group

export function createWindow(id: ID): Window {
  return { id: `${id}` }
}

export function createGroup(left: Node, right: Node, id?: ID): Group {
  return {
    id: id ? id : generateUUID(),
    left,
    right
  }
}

export function isGroup(n: Window | Group): n is Group {
  return (n as Group).left !== undefined
}

export function addWindow(node: Node | undefined, window: ID): Node {
  if (!node) {
    return createWindow(window) as Window
  }

  if (isGroup(node)) {
    return createGroup(node.left, addWindow(node.right, window))
  }

  return createGroup(node, createWindow(window))
}

function removeWindowFromGroup(group: Group, window: ID) {
  const newLeft = removeWindow(group.left, window)
  const newRight = removeWindow(group.right, window)

  if (!newLeft && !newRight) {
    return undefined
  }

  if (newLeft && newRight) {
    return createGroup(newLeft, newRight)
  }

  return newLeft ? newLeft : newRight
}

export function removeWindow(
  node: Node | undefined,
  window: ID
): Node | undefined {
  if (!node) {
    return undefined
  }

  if (isGroup(node)) {
    return removeWindowFromGroup(node, window)
  }

  // Window
  return node.id === window ? undefined : node
}
