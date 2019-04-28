import {
  addWindow,
  debugStr,
  findParent,
  removeWindow,
  createGroup,
  defaultGroupProperties,
  Group,
  createLayout
} from "./layout"

describe("Layout", () => {
  it("should be empty initially", () => {
    let layout = createLayout()

    expect(debugStr(layout)).toEqual("Empty")
  })

  it("should insert a single window as a 'monocle' window", () => {
    let layout = createLayout()

    layout = addWindow(layout, "5")

    expect(debugStr(layout)).toEqual("<5>")
  })

  it("should create a group when second window is inserted", () => {
    let layout = createLayout()

    layout = addWindow(layout, "4")
    layout = addWindow(layout, "7")

    expect(debugStr(layout)).toEqual("<(LtR/0.5:4,7)>")
  })

  it("should support removing a single window", () => {
    let layout = createLayout()

    layout = addWindow(layout, "5")
    layout = removeWindow(layout, "5")

    expect(layout.root).toBeUndefined()
  })

  it("should support removing a window from a group", () => {
    let layout = createLayout()

    layout = addWindow(layout, "3")
    layout = addWindow(layout, "4")
    layout = removeWindow(layout, "3")!

    expect(debugStr(layout)).toEqual("<4>")
  })

  it("should support adding three windows", () => {
    let layout = createLayout()

    layout = addWindow(layout, "4")
    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")

    expect(debugStr(layout)).toEqual("<(LtR/0.5:4,(TtB/0.5:5,6))>")
  })

  it("should support removing a child one level down", () => {
    let layout = createLayout()

    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")
    layout = addWindow(layout, "7")

    layout = removeWindow(layout, "7")!

    expect(debugStr(layout)).toEqual("<(LtR/0.5:5,6)>")
  })

  it("should support removing the left child in a multilevel layout", () => {
    let layout = createLayout()

    layout = addWindow(layout, "5")
    layout = addWindow(layout, "6")
    layout = addWindow(layout, "7")

    layout = removeWindow(layout, "5")!

    expect(debugStr(layout)).toEqual("<(TtB/0.5:6,7)>")
  })

  it("should support finding the parent of a node", () => {
    let group

    group = createGroup(
      "1",
      createGroup("2", "3", defaultGroupProperties, "group1"),
      defaultGroupProperties,
      "group0"
    )

    const node = findParent(group, "3") as Group

    expect(node.id).toEqual("group1")
  })

  describe("Group", () => {
    it("should create a random ID by default", () => {
      const group = createGroup("1", "2", defaultGroupProperties)

      expect(group.id).toBeDefined()
    })

    it("should support giving an optional id to group", () => {
      const group = createGroup("1", "2", defaultGroupProperties, "group0")

      expect(group.id).toEqual("group0")
    })
  })
})
