import { create, zeroRect } from "./layout"

describe("Layout", () => {
  it("Should have a root node", () => {
    const layout = create(zeroRect)

    expect(layout.root).toBeUndefined()
    expect(layout.rect).toEqual(zeroRect)
  })
})
