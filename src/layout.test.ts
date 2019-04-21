import { create, addWindow, zeroRect } from "./layout"

describe("Layout", () => {
  it("Should have a root node", () => {
    const layout = create(zeroRect)

    expect(layout.root).toBeUndefined()
  })

  it("should insert a single window as a 'monocle' window", () => {
    const layout = create(zeroRect)
    const window = {}

    const newLayout = addWindow(layout, 5)

    expect(newLayout.root!.id).toEqual(5)
  })

  // it("should create a group when second window is inserted", () => {
  //   const layout = create(zeroRect)
  // })
})
