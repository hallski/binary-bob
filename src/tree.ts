import { generateUUID } from "./utils"

export type ID = string

export interface Group {
  id: string
  left: Node
  right: Node
}

export type Node = ID | Group

export function createGroup(left: Node, right: Node, id?: ID): Group {
  return {
    id: id ? id : generateUUID(),
    left,
    right
  }
}

export function isGroup(n: Node): n is Group {
  return (n as Group).left !== undefined
}

export function addWindow(node: Node | undefined, window: ID): Node {
  if (!node) {
    return window
  }

  if (isGroup(node)) {
    return createGroup(node.left, addWindow(node.right, window))
  }

  return createGroup(node, window)
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
  return node === window ? undefined : node
}

function findParentImpl(node: Node, id: ID): Node | undefined {
  return node === id ? node : undefined
}

export function findParent(
  node: Node,
  id: ID,
  parent?: Group
): Node | undefined {
  if (isGroup(node)) {
    return findParent(node.left, id, node) || findParent(node.right, id, node)
  }

  return node === id ? parent : undefined
}
