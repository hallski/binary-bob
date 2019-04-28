import { isGroup, Layout, Node, Orientation } from "./layout"

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
    return `(${orientationStr(node.props.orientation)}/${
      node.props.ratio
    }:${nodeDebugStr(node.left)},${nodeDebugStr(node.right)})`
  } else {
    return node
  }
}

export function debugStr(layout: Layout): string {
  return layout.root ? `<${nodeDebugStr(layout.root)}>` : "Empty"
}
