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

export interface LayoutProperties {
  ratio: number
  orientation: Orientation
}

export const defaultLayout = {
  ratio: 0.5,
  orientation: Orientation.LeftToRight
}

export interface GlobalLayoutProperties {
  defaultRatio: number
  defaultOrientation: Orientation
  outerPadding: number
  windowMargin: number
}

const defaultGlobalLayout = {
  defaultRatio: defaultLayout.ratio,
  defaultOrientation: defaultLayout.orientation,
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
  layout: LayoutProperties
}

export type Node = ID | Group

export interface WindowFrame {
  window: ID
  frame: Rect
}

export interface Layout {
  root?: Node

  globalLayout: GlobalLayoutProperties
}

export function createLayout(
  root?: Node,
  globalLayout?: GlobalLayoutProperties
): Layout {
  return {
    root,
    globalLayout: globalLayout || defaultGlobalLayout
  }
}

export function createGroup(
  left: Node,
  right: Node,
  layout: LayoutProperties,
  id?: ID
): Group {
  return {
    id: id ? id : generateUUID(),
    left,
    right,
    layout
  }
}

export function isGroup(n: Node): n is Group {
  return (n as Group).left !== undefined
}

export function addWindow(layout: Layout, window: ID) {
  if (!layout.root) {
    return createLayout(window, layout.globalLayout)
  }

  return createLayout(
    nodeAddWindow(
      layout.root,
      window,
      layout.globalLayout.defaultOrientation,
      layout.globalLayout
    ),
    layout.globalLayout
  )
}

export function removeWindow(layout: Layout, window: ID) {
  if (!layout.root) {
    return layout
  }

  return createLayout(
    nodeRemoveWindow(layout.root, window, layout.globalLayout),
    layout.globalLayout
  )
}

export function nodeAddWindow(
  node: Node | undefined,
  window: ID,
  orientation: Orientation,
  globalLayout: GlobalLayoutProperties
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
        nextOrientation(node.layout.orientation),
        globalLayout
      ),
      node.layout
    )
  }

  return createGroup(node, window, {
    ratio: globalLayout.defaultRatio,
    orientation: orientation
  })
}

function nodeRemoveWindowFromGroup(
  group: Group,
  window: ID,
  globalLayout: GlobalLayoutProperties
) {
  const newLeft = nodeRemoveWindow(group.left, window, globalLayout)
  const newRight = nodeRemoveWindow(group.right, window, globalLayout)

  if (!newLeft && !newRight) {
    return undefined
  }

  if (newLeft && newRight) {
    return createGroup(newLeft, newRight, group.layout)
  }

  return newLeft ? newLeft : newRight
}

export function nodeRemoveWindow(
  node: Node | undefined,
  window: ID,
  globalLayout: GlobalLayoutProperties
): Node | undefined {
  if (!node) {
    return undefined
  }

  if (isGroup(node)) {
    return nodeRemoveWindowFromGroup(node, window, globalLayout)
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
  props: LayoutProperties
): [Rect, Rect] {
  let leftRect
  let rightRect

  let leftWidth, rightWidth
  let leftHeight, rightHeight
  switch (props.orientation) {
    case Orientation.LeftToRight:
      leftWidth = Math.floor(width * props.ratio)
      leftRect = { x, y, width: leftWidth, height: height }
      rightRect = { x: x + leftWidth, y, width: width - leftWidth, height }
      break
    case Orientation.RightToLeft:
      leftWidth = Math.floor(width * props.ratio)
      rightWidth = width - leftWidth
      leftRect = { x: x + rightWidth, y, width: leftWidth, height: height }
      rightRect = { x, y, width: width - leftWidth, height }
      break
    case Orientation.TopToBottom:
      leftHeight = Math.floor(height * props.ratio)
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
      leftHeight = Math.floor(height * props.ratio)
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
  const [leftFrame, rightFrame] = splitRect(frame, group.layout)

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

function orientationStr(orientation: Orientation) {
  switch (orientation) {
    case Orientation.LeftToRight:
      return "LtR"
    case Orientation.RightToLeft:
      return "RtL"
    case Orientation.TopToBottom:
      return "TtB"
    case Orientation.BottomToTop:
      return "BtT"
  }
}

function nodeDebugStr(node: Node): string {
  if (isGroup(node)) {
    return `(${orientationStr(node.layout.orientation)}/${
      node.layout.ratio
    }:${nodeDebugStr(node.left)},${nodeDebugStr(node.right)})`
  } else {
    return node
  }
}

export function debugStr(layout: Layout): string {
  return layout.root ? `<${nodeDebugStr(layout.root)}>` : "Empty"
}
