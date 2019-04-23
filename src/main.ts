import { Meta } from "./platform"
import {
  create,
  addWindow,
  removeWindow,
  calculateFrames,
  WindowFrame,
  Rect
} from "./layout"

declare function log(msg: string): void

function relayout(frames: WindowFrame[], windows: any[]) {
  const m = frames.reduce((acc, f) => ({ ...acc, [f.window]: f.frame }), {} as {
    [key: number]: Rect
  })

  windows.forEach(window => {
    const { x, y, width, height } = m[window.get_stable_sequence()]
    window.move_resize_frame(true, x, y, width, height)
  })
}

export const startMe = (workspaceManager: any) => {
  log("I've been started")

  return
  log(`Monitor manager: ${Meta.MonitorManager.get()}`)
  // TODO: Ignore workspace 0 for now, makes it easier to develop until I get somewhere stablish
  let layout = create()
  const workspace = workspaceManager.get_workspace_by_index(0)
  const area = workspace.get_work_area_for_monitor(0)
  let windows = [] as any[]
  log(`workspace: ${workspace}`)
  const index = 0

  const addId = workspace.connect("window-added", (ws: any, window: any) => {
    windows.push(window)
    const rect = window.get_frame_rect()
    log(
      `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
        rect.width
      }, ${rect.height})`
    )

    layout = addWindow(layout, window.get_stable_sequence())
    const frames = calculateFrames(layout, area)
    const frameDebug = calculateFrames(layout, area).map(
      ({ window, frame: { x, y, width, height } }) =>
        `${window} -> (${x},${y}-${width}x${height})`
    )

    log(`New layout: ${layout.root.getId()}: ${frameDebug}`)
    relayout(frames, windows)
  })

  const removeId = workspace.connect(
    "window-removed",
    (ws: any, window: any) => {
      windows = windows.filter(win => win !== window)

      const rect = window.get_frame_rect()
      log(
        `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
          rect.width
        }, ${rect.height})`
      )

      layout = removeWindow(layout, window.get_stable_sequence())
      const frames = calculateFrames(layout, area)
      const frameDebug = calculateFrames(layout, area).map(
        ({ window, frame: { x, y, width, height } }) =>
          `${window} -> (${x},${y}-${width}x${height})`
      )

      log(`New layout: ${layout.root.getId()}: ${frameDebug}`)

      relayout(frames, windows)
    }
  )
}
