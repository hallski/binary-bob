const Me = imports.misc.extensionUtils.getCurrentExtension();
const WM = Me.imports.bob.windowmanager;
const Bob = Me.imports.main.bob;

function init() {
  log("Binary Bob at Your Service!");
  Bob.startMe();
}

function enable() {
  log("Binary Bob getting to work!");
  //  const wm = WM.create();
}

function disable() {
  log("Binary Bob decides to go for after work");
  //  WM.destroy(wm);
}