import { Meta } from "./platform"

declare function log(msg: string): void

export const startMe = () => {
  log("I've been started")

  log(`Monitor manager: ${Meta.MonitorManager.get()}`)

  return {}
}
