import { generateUUID } from "./utils"

export type ID = string

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export enum Orientation {
  LeftToRight = 0, // Left branch is left of right branch
  TopToBottom = 1, // Left branch is above right branch
  RightToLeft = 2, // Left branch is right of right branch
  BottomToTop = 3 // Left branch is below the right branch
}

export interface GroupProperties {
  ratio: number
  orientation: Orientation
}

export const defaultGroupProperties = {
  ratio: 0.5,
  orientation: Orientation.LeftToRight
}

export interface LayoutProperties {
  defaultRatio: number
  defaultOrientation: Orientation
  outerPadding: number
  windowMargin: number
}

const defaultLayoutProperties = {
  defaultRatio: defaultGroupProperties.ratio,
  defaultOrientation: defaultGroupProperties.orientation,
  outerPadding: 0,
  windowMargin: 0
}

function nextOrientation(orientation: Orientation) {
  return (orientation + 1) % 4
}

export interface Group {
  id: string
  left: Node
  right: Node
  props: GroupProperties
}

export type Node = ID | Group

export interface WindowFrame {
  window: ID
  frame: Rect
}

export interface Layout {
  root?: Node

  props: LayoutProperties
}

export function createLayout(root?: Node, props?: LayoutProperties): Layout {
  return {
    root,
    props: props || defaultLayoutProperties
  }
}

export function createGroup(
  left: Node,
  right: Node,
  props: GroupProperties,
  id?: ID
): Group {
  return {
    id: id ? id : generateUUID(),
    left,
    right,
    props
  }
}

export function isGroup(n: Node): n is Group {
  return (n as Group).left !== undefined
}

export function addWindow(layout: Layout, window: ID) {
  if (!layout.root) {
    return createLayout(window, layout.props)
  }

  return createLayout(
    nodeAddWindow(
      layout.root,
      window,
      layout.props.defaultOrientation,
      layout.props
    ),
    layout.props
  )
}

export function removeWindow(layout: Layout, window: ID) {
  if (!layout.root) {
    return layout
  }

  return createLayout(
    nodeRemoveWindow(layout.root, window, layout.props),
    layout.props
  )
}

export function nodeAddWindow(
  node: Node | undefined,
  window: ID,
  orientation: Orientation,
  layoutProps: LayoutProperties
): Node {
  if (!node) {
    return window
  }

  if (isGroup(node)) {
    return createGroup(
      node.left,
      nodeAddWindow(
        node.right,
        window,
        nextOrientation(node.props.orientation),
        layoutProps
      ),
      node.props
    )
  }

  return createGroup(node, window, {
    ratio: layoutProps.defaultRatio,
    orientation: orientation
  })
}

function nodeRemoveWindowFromGroup(
  group: Group,
  window: ID,
  layoutProps: LayoutProperties
) {
  const newLeft = nodeRemoveWindow(group.left, window, layoutProps)
  const newRight = nodeRemoveWindow(group.right, window, layoutProps)

  if (!newLeft && !newRight) {
    return undefined
  }

  if (newLeft && newRight) {
    return createGroup(newLeft, newRight, group.props)
  }

  return newLeft ? newLeft : newRight
}

export function nodeRemoveWindow(
  node: Node | undefined,
  window: ID,
  layoutProps: LayoutProperties
): Node | undefined {
  if (!node) {
    return undefined
  }

  if (isGroup(node)) {
    return nodeRemoveWindowFromGroup(node, window, layoutProps)
  }

  // Window
  return node === window ? undefined : node
}

export function findParent(
  node: Node,
  id: ID,
  parent?: Group
): Group | undefined {
  if (isGroup(node)) {
    return findParent(node.left, id, node) || findParent(node.right, id, node)
  }

  return node === id ? parent : undefined
}

function splitRect(
  { x, y, width, height }: Rect,
  layout: GroupProperties
): [Rect, Rect] {
  let leftRect
  let rightRect

  let leftWidth, rightWidth
  let leftHeight, rightHeight
  switch (layout.orientation) {
    case Orientation.LeftToRight:
      leftWidth = Math.floor(width * layout.ratio)
      leftRect = { x, y, width: leftWidth, height: height }
      rightRect = { x: x + leftWidth, y, width: width - leftWidth, height }
      break
    case Orientation.RightToLeft:
      leftWidth = Math.floor(width * layout.ratio)
      rightWidth = width - leftWidth
      leftRect = { x: x + rightWidth, y, width: leftWidth, height: height }
      rightRect = { x, y, width: width - leftWidth, height }
      break
    case Orientation.TopToBottom:
      leftHeight = Math.floor(height * layout.ratio)
      rightHeight = height - leftHeight

      leftRect = { x, y, width, height: leftHeight }
      rightRect = {
        x: x,
        y: y + leftHeight,
        width,
        height: rightHeight
      }
      break
    case Orientation.BottomToTop:
      leftHeight = Math.floor(height * layout.ratio)
      rightHeight = height - leftHeight

      leftRect = { x, y: y + rightHeight, width, height: leftHeight }
      rightRect = {
        x,
        y,
        width,
        height: height - leftHeight
      }
      break
    default:
      leftRect = rightRect = { x, y, width, height }
      break
  }

  return [leftRect, rightRect]
}

function calculateWindowFrame(window: ID, frame: Rect): WindowFrame[] {
  return [{ window, frame }]
}

function calculateGroupFrames(group: Group, frame: Rect): WindowFrame[] {
  const [leftFrame, rightFrame] = splitRect(frame, group.props)

  return calculateNodeFrames(group.left, leftFrame).concat(
    calculateNodeFrames(group.right, rightFrame)
  )
}

function calculateNodeFrames(node: Node, frame: Rect): WindowFrame[] {
  return isGroup(node)
    ? calculateGroupFrames(node, frame)
    : calculateWindowFrame(node, frame)
}

export function calculateFrames(layout: Layout, frame: Rect): WindowFrame[] {
  if (!layout.root) {
    return []
  }

  return calculateNodeFrames(layout.root, frame)
}
