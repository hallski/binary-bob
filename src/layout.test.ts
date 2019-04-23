import { create, addWindow, removeWindow } from "./layout"

describe("Layout", () => {
  it("Should have a root node", () => {
    let layout = create()

    expect(layout.root.getId()).toEqual("Empty")
  })

  it("should insert a single window as a 'monocle' window", () => {
    let layout = create()

    layout = addWindow(layout, 5)

    expect(layout.root.getId()).toEqual("<5>")
  })

  it("should create a 'binary' group when second window is inserted", () => {
    let layout = create()

    layout = addWindow(layout, 4)
    layout = addWindow(layout, 7)

    expect(layout.root.getId()).toEqual("<(4,7)>")
  })

  it("should support removing a 'monocle' window", () => {
    let layout = create()

    layout = addWindow(layout, 5)
    layout = removeWindow(layout, 5)

    expect(layout.root.getId()).toEqual("Empty")
  })

  it("should support removing a window from a group", () => {
    let layout = create()

    layout = addWindow(layout, 3)
    layout = addWindow(layout, 4)
    layout = removeWindow(layout, 3)

    expect(layout.root.getId()).toEqual("<4>")
  })

  it("should support adding three windows", () => {
    let layout = create()

    layout = addWindow(layout, 4)
    layout = addWindow(layout, 5)
    layout = addWindow(layout, 6)

    expect(layout.root.getId()).toEqual("<(4,(5,6))>")
  })

  it("should support removing a child one level down", () => {
    let layout = create()

    layout = addWindow(layout, 5)
    layout = addWindow(layout, 6)
    layout = addWindow(layout, 7)

    layout = removeWindow(layout, 7)

    expect(layout.root.getId()).toEqual("<(5,6)>")
  })

  it("should support removing the left child in a multilevel tree", () => {
    let layout = create()

    layout = addWindow(layout, 5)
    layout = addWindow(layout, 6)
    layout = addWindow(layout, 7)

    layout = removeWindow(layout, 5)

    expect(layout.root.getId()).toEqual("<(6,7)>")
  })
})
