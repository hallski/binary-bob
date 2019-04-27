import { calculateFrames, Orientation } from "./layout"
import { createWindow, createGroup } from "./tree"

describe("Layout", () => {
  it("should not return any frames for an empty tree", () => {
    expect(
      calculateFrames(undefined, { x: 0, y: 0, width: 100, height: 100 })
    ).toEqual([])
  })

  it("should give a single window the full frame", () => {
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(createWindow("123"), frame)
    expect(frames).toEqual([{ window: "123", frame: frame }])
  })

  it("should split two windows equally", () => {
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(
      createGroup(createWindow("123"), createWindow("456")),
      frame
    )
    expect(frames).toEqual([
      { window: "123", frame: { x: 0, y: 0, width: 50, height: 100 } },
      { window: "456", frame: { x: 50, y: 0, width: 50, height: 100 } }
    ])
  })

  it("should support splitting a frame based on ratio", () => {
    const frame = { x: 0, y: 0, width: 100, height: 100 }
    const frames = calculateFrames(
      createGroup(createWindow("111"), createWindow("222"), "group1"),
      frame,
      {
        group1: {
          ratio: 0.8,
          orientation: Orientation.LeftToRight
        }
      }
    )

    expect(frames).toEqual([
      { window: "111", frame: { x: 0, y: 0, width: 80, height: 100 } },
      { window: "222", frame: { x: 80, y: 0, width: 20, height: 100 } }
    ])
  })
})
