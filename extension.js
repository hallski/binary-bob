const Me = imports.misc.extensionUtils.getCurrentExtension();
const WM = Me.imports.bob.windowmanager;

//global.log(`WM is ${WM}`);
//let wm;

function init() {
  log("Binary Bob at Your Service!");
}

function enable() {
  log("Binary Bob getting to work!");
  const wm = WM.create();
}

function disable() {
  log("Binary Bob decides to go for after work");
  //  WM.destroy(wm);
}
