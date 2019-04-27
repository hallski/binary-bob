import { addWindow, removeWindow, createGroup, isGroup, Node } from "./tree"

function testID(node: Node): string {
  if (isGroup(node)) {
    return `(${testID(node.left)},${testID(node.right)})`
  } else {
    return node
  }
}

describe("Tree", () => {
  it("should insert a single window as a 'monocle' window", () => {
    let tree

    tree = addWindow(tree, "5")

    expect(testID(tree)).toEqual("5")
  })

  it("should create a group when second window is inserted", () => {
    let tree

    tree = addWindow(tree, "4")
    tree = addWindow(tree, "7")

    expect(testID(tree)).toEqual("(4,7)")
  })

  it("should support removing a single window", () => {
    let tree

    tree = addWindow(tree, "5")
    tree = removeWindow(tree, "5")

    expect(tree).toBeUndefined()
  })

  it("should support removing a window from a group", () => {
    let tree

    tree = addWindow(tree, "3")
    tree = addWindow(tree, "4")
    tree = removeWindow(tree, "3")!

    expect(testID(tree)).toEqual("4")
  })

  it("should support adding three windows", () => {
    let tree

    tree = addWindow(tree, "4")
    tree = addWindow(tree, "5")
    tree = addWindow(tree, "6")

    expect(testID(tree)).toEqual("(4,(5,6))")
  })

  it("should support removing a child one level down", () => {
    let tree

    tree = addWindow(tree, "5")
    tree = addWindow(tree, "6")
    tree = addWindow(tree, "7")

    tree = removeWindow(tree, "7")!

    expect(testID(tree)).toEqual("(5,6)")
  })

  it("should support removing the left child in a multilevel tree", () => {
    let tree

    tree = addWindow(tree, "5")
    tree = addWindow(tree, "6")
    tree = addWindow(tree, "7")

    tree = removeWindow(tree, "5")!

    expect(testID(tree)).toEqual("(6,7)")
  })


  describe("Group", () => {
    it("should create a random ID by default", () => {
      const group = createGroup("1", "2")

      expect(group.id).toBeDefined()
    })

    it("should support giving an optional id to group", () => {
      const group = createGroup("1", "2", "group0")

      expect(group.id).toEqual("group0")
    })
  })
})
