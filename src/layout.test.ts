import { create, addWindow, removeWindow, zeroRect } from "./layout"

describe("Layout", () => {
  it("Should have a root node", () => {
    let layout = create(zeroRect)

    expect(layout.root.kind).toEqual("Empty")
  })

  it("should insert a single window as a 'monocle' window", () => {
    let layout = create(zeroRect)

    layout = addWindow(layout, 5)

    expect(layout.root.kind).toEqual("Monocle")
  })

  it("should create a 'binary' group when second window is inserted", () => {
    let layout = create(zeroRect)

    layout = addWindow(layout, 4)
    layout = addWindow(layout, 7)

    expect(layout.root.kind).toEqual("Binary")
  })

  it("should support removing a 'monocle' window", () => {
    let layout = create(zeroRect)

    layout = addWindow(layout, 5)
    layout = removeWindow(layout, 5)

    expect(layout.root.kind).toEqual("Empty")
  })

  it("should support removing a window from a group", () => {
    let layout = create(zeroRect)

    layout = addWindow(layout, 3)
    layout = addWindow(layout, 4)
    layout = removeWindow(layout, 3)

    expect(layout.root.kind).toEqual("Monocle")
  })
})
