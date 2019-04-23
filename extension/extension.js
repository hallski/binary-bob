const Me = imports.misc.extensionUtils.getCurrentExtension()
const Bob = Me.imports.main.bob

let bob

function init() {
  log("Binary Bob at Your Service!")
  bob = Bob.startMe(global.workspace_manager)
}

function enable() {
  log("Binary Bob getting to work!")
  //  const wm = WM.create();
}

function disable() {
  log("Binary Bob decides to go for after work")
  //  WM.destroy(wm);
}
