import {
  calculateFrames,
  Orientation,
  createGroup,
  createLayout,
  defaultGroupProperties
} from "./layout"

describe("Layout", () => {
  it("should not return any frames for an empty tree", () => {
    const layout = createLayout()
    expect(
      calculateFrames(layout, { x: 0, y: 0, width: 100, height: 100 })
    ).toEqual([])
  })

  it("should give a single window the full frame", () => {
    const layout = createLayout("123")
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(layout, frame)
    expect(frames).toEqual([{ window: "123", frame: frame }])
  })

  it("should split two windows equally", () => {
    const layout = createLayout(
      createGroup("123", "456", defaultGroupProperties)
    )
    const frame = { x: 0, y: 0, width: 100, height: 100 }

    const frames = calculateFrames(layout, frame)
    expect(frames).toEqual([
      { window: "123", frame: { x: 0, y: 0, width: 50, height: 100 } },
      { window: "456", frame: { x: 50, y: 0, width: 50, height: 100 } }
    ])
  })

  it("should support splitting a frame based on ratio, left to right", () => {
    const layout = createLayout(
      createGroup("111", "222", {
        ratio: 0.8,
        orientation: Orientation.LeftToRight
      })
    )
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(layout, frame)

    expect(frames).toEqual([
      { window: "111", frame: { x: 0, y: 0, width: 80, height: 100 } },
      { window: "222", frame: { x: 80, y: 0, width: 20, height: 100 } }
    ])
  })

  it("should support right to left orientation", () => {
    const layout = createLayout(
      createGroup("111", "222", {
        ratio: 0.65,
        orientation: Orientation.RightToLeft
      })
    )
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(layout, frame)

    expect(frames).toEqual([
      { window: "111", frame: { x: 35, y: 0, width: 65, height: 100 } },
      { window: "222", frame: { x: 0, y: 0, width: 35, height: 100 } }
    ])
  })
  it("should support top to bottom orientation", () => {
    const layout = createLayout(
      createGroup("111", "222", {
        ratio: 0.65,
        orientation: Orientation.TopToBottom
      })
    )
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(layout, frame)

    expect(frames).toEqual([
      { window: "111", frame: { x: 0, y: 0, width: 100, height: 65 } },
      { window: "222", frame: { x: 0, y: 65, width: 100, height: 35 } }
    ])
  })

  it("should support bottom to top orientation", () => {
    const layout = createLayout(
      createGroup("111", "222", {
        ratio: 0.65,
        orientation: Orientation.BottomToTop
      })
    )
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(layout, frame)

    expect(frames).toEqual([
      { window: "111", frame: { x: 0, y: 35, width: 100, height: 65 } },
      { window: "222", frame: { x: 0, y: 0, width: 100, height: 35 } }
    ])
  })
})
