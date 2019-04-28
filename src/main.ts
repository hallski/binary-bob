import { Meta } from "./platform"
import {
  addWindow,
  debugStr,
  removeWindow,
  createLayout,
  calculateFrames,
  WindowFrame,
  Rect,
  Layout
} from "./layout"

declare function log(msg: string): void

function relayout(layout: Layout, windows: any[], workspace: any) {
  log("Relayout")
  const area = workspace.get_work_area_for_monitor(0)
  const frames = calculateFrames(layout, area)
  const m = frames.reduce((acc, f) => ({ ...acc, [f.window]: f.frame }), {} as {
    [key: number]: Rect
  })

  windows.forEach(window => {
    const { x, y, width, height } = m[window.get_stable_sequence()]
    window.move_resize_frame(false, x, y, width, height)
  })
}

export const startMe = (workspaceManager: any) => {
  log("I've been started")

  log(`Monitor manager: ${Meta.MonitorManager.get()}`)
  // TODO: Ignore workspace 0 for now, makes it easier to develop until I get somewhere stablish
  let layout = createLayout()
  const workspace = workspaceManager.get_workspace_by_index(0)
  const area = workspace.get_work_area_for_monitor(0)
  let windows = [] as any[]
  log(`workspace: ${workspace}`)
  const index = 0

  const addId = workspace.connect("window-added", (ws: any, window: any) => {
    if (window.get_window_type() !== Meta.WindowType.NORMAL) {
      return
    }

    windows.push(window)
    const windowID = `${window.get_stable_sequence()}`

    window.connect("workspace-changed", () => {
      log(`[${windowID}]: Workspace canged`)
      Meta.later_add(Meta.LaterType.IDLE, () => {
        relayout(layout, windows, workspace)
      })
    })
    window.connect("raised", () => {
      log(`[${windowID}]: Raised`)
    })
    window.connect("size-changed", () => {
      log(`[${windowID}]: Size changed`)
    })
    window.connect("position-changed", () => {
      log(`[${windowID}]: Position changed`)
    })
    const connectID = window.connect("focus", () => {
      log(`[${windowID}]: Focus`)
      Meta.later_add(Meta.LaterType.IDLE, () => {
        relayout(layout, windows, workspace)
      })
    })

    const rect = window.get_frame_rect()
    layout = addWindow(layout, windowID)
    log(`New layout: ${debugStr(layout)}`)
  })

  const removeId = workspace.connect(
    "window-removed",
    (ws: any, window: any) => {
      const windowID = `${window.get_stable_sequence()}`
      windows = windows.filter(win => win !== window)

      const rect = window.get_frame_rect()
      log(
        `Window remove (${windowID}) from workspace ${index}: (${rect.x}, ${
          rect.y
        }, ${rect.width}, ${rect.height})`
      )

      log(`Removing ${windowID} from layout: ${debugStr(layout)}`)

      layout = removeWindow(layout, windowID)

      // const frameDebug = calculateFrames(layout, area).map(
      //   ({ window, frame: { x, y, width, height } }) =>
      //     `${window} -> (${x},${y}-${width}x${height})`
      // )
      log(`New layout after removing: ${debugStr(layout)}`)

      const frames = calculateFrames(layout, area)
      relayout(layout, windows, workspace)

      // log(`New layout: ${layout.root.getId()}: ${frameDebug}`)
    }
  )
}
