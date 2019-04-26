import { addWindow, removeWindow, createWindow, isGroup, Node } from "./tree"

function testID(node: Node): string {
  if (isGroup(node)) {
    return `(${testID(node.left)},${testID(node.right)})`
  } else {
    return node.id
  }
}

describe("Layout", () => {
  it("should insert a single window as a 'monocle' window", () => {
    let layout

    layout = addWindow(layout, "5")

    expect(testID(layout)).toEqual("5")
  })

  it("should create a 'binary' group when second window is inserted", () => {
    let layout

    layout = addWindow(layout, "4")
    layout = addWindow(layout, "7")

    expect(testID(layout)).toEqual("(4,7)")
  })

  it("should support removing a 'monocle' window", () => {
    let layout

    layout = addWindow(layout, "5")
    layout = removeWindow(layout, "5")

    expect(layout).toBeUndefined()
  })

  it("should support removing a window from a group", () => {
    let layout

    layout = addWindow(layout, "3")
    layout = addWindow(layout, "4")
    layout = removeWindow(layout, "3")!

    expect(testID(layout)).toEqual("4")
  })

  it("should support adding three windows", () => {
    let layout

    layout = addWindow(layout, "4")
    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")

    expect(testID(layout)).toEqual("(4,(5,6))")
  })

  it("should support removing a child one level down", () => {
    let layout

    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")
    layout = addWindow(layout, "7")

    layout = removeWindow(layout, "7")!

    expect(testID(layout)).toEqual("(5,6)")
  })

  it("should support removing the left child in a multilevel tree", () => {
    let layout

    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")
    layout = addWindow(layout, "7")

    layout = removeWindow(layout, "5")!

    expect(testID(layout)).toEqual("(6,7)")
  })
})
