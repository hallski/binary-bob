import { Meta } from "./platform"
import { create, addWindow, removeWindow } from "./layout"

declare function log(msg: string): void

export const startMe = (workspaceManager: any) => {
  log("I've been started")

  log(`Monitor manager: ${Meta.MonitorManager.get()}`)
  // TODO: Ignore workspace 0 for now, makes it easier to develop until I get somewhere stablish
  let layout = create()
  const workspace = workspaceManager.get_workspace_by_index(0)
  log(`workspace: ${workspace}`)
  const index = 0

  const addId = workspace.connect("window-added", (ws: any, window: any) => {
    const rect = window.get_frame_rect()
    log(
      `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
        rect.width
      }, ${rect.height})`
    )

    layout = addWindow(layout, window.get_stable_sequence())

    log(`New layout: ${layout.root.getId()}`)
  })

  const removeId = workspace.connect(
    "window-removed",
    (ws: any, window: any) => {
      const rect = window.get_frame_rect()
      log(
        `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
          rect.width
        }, ${rect.height})`
      )

      layout = removeWindow(layout, window.get_stable_sequence())

      log(`New layout: ${layout.root.getId()}`)
    }
  )
}
