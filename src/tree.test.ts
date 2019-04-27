import {
  addWindow,
  removeWindow,
  createGroup,
  createWindow,
  isGroup,
  Node
} from "./tree"

function testID(node: Node): string {
  if (isGroup(node)) {
    return `(${testID(node.left)},${testID(node.right)})`
  } else {
    return node.id
  }
}

describe("Tree", () => {
  it("should insert a single window as a 'monocle' window", () => {
    let layout

    layout = addWindow(layout, "5")

    expect(testID(layout)).toEqual("5")
  })

  it("should create a group when second window is inserted", () => {
    let layout

    layout = addWindow(layout, "4")
    layout = addWindow(layout, "7")

    expect(testID(layout)).toEqual("(4,7)")
  })

  it("should support removing a single window", () => {
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

  describe("Group", () => {
    it("should create a random ID by default", () => {
      const group = createGroup(createWindow("1"), createWindow("2"))

      expect(group.id).toBeDefined()
    })

    it("should support giving an optional id to group", () => {
      const group = createGroup(createWindow("1"), createWindow("2"), "group0")

      expect(group.id).toEqual("group0")
    })
  })
})
