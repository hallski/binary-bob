const Me = imports.misc.extensionUtils.getCurrentExtension();
const Utils = Me.imports.bob.utils;

function create(frame) {
  return {
    root: null,
    frame
  };
}

const splitFrame = (frame, ratio, orientation) => {
  const a = {
    x: frame.x,
    y: frame.y,
    width: orientation ? frame.width * ratio : frame.width,
    height: orientation ? frame.height : frame.height * ratio
  };
  const b = {
    x: orientation ? frame.x + a.width : frame.x,
    y: orientation ? frame.y : frame.y + a.height,
    width: orientation ? frame.width * (1 - ratio) : frame.width,
    height: orientation ? frame.height : frame.height * (1 - ratio)
  };
  return [a, b];
};

const layoutGroup = (group, frame) => {
  log(`Layout group with frame ${Utils.frameToStr(frame)}`);
  const [aFrame, bFrame] = splitFrame(frame, group.ratio);

  if (group.a.isGroup) {
    layoutGroup(group.a, aFrame);
  } else {
    log(`Setting a frame to ${Utils.frameToStr(aFrame)}`);
    group.a.window.move_resize_frame(
      true,
      Math.floor(aFrame.x),
      Math.floor(aFrame.y),
      Math.floor(aFrame.width),
      Math.floor(aFrame.height)
    );
  }

  if (group.b.isGroup) {
    layoutGroup(group.b, bFrame);
  } else {
    log(`Setting b frame to ${Utils.frameToStr(bFrame)}`);
    group.b.window.move_resize_frame(
      true,
      Math.floor(bFrame.x),
      Math.floor(bFrame.y),
      Math.floor(bFrame.width),
      Math.floor(bFrame.height)
    );
  }
};

const layoutMonocle = (window, frame) => {
  log(`Layout monocle with frame ${Utils.frameToStr(frame)}`);
  window.window.move_resize_frame(
    true,
    frame.x,
    frame.y,
    frame.width,
    frame.height
  );
};

const createGroup = (parent, a, b, orientation) => {
  const group = {
    isGroup: true,
    parent: parent,
    ratio: 0.5,
    orientation: orientation,
    a: a,
    b: b
  };

  a.parent = group;
  b.parent = group;

  return group;
};

const createWindow = window => ({
  isGroup: false,
  parent: null,
  window: window
});

// Public
var addWindow = (layout, window) => {
  if (!layout.root) {
    log(`Creating a monocle window`);
    layout.root = createWindow(window);
  } else if (layout.root.isGroup === false) {
    // Monocle
    log("Replacing monocle view with a group");
    const monocleWindow = layout.root;
    layout.root = createGroup(null, monocleWindow, createWindow(window), false);
  } else {
    // Already a group in the root
    log(`There is a group here, try to find the insertion point`);
    // Follow b until not a group
    let g = layout.root.b;
    while (g.isGroup) {
      g = g.b;
    }

    g.parent.b = createGroup(
      g.parent,
      g,
      createWindow(window),
      !g.parent.orientation
    );
  }

  relayout(layout);
  // Find insertion point
  // Create group
  // Add to group
  // Relayout
};

var removeWindow = (layout, window) => {
  if (!layout.root) {
    log(
      "ERROR: Window is removed from layout but there are no windows in the layout"
    );
  }
  if (layout.root.window === window) {
    log("Removing last window");
    layout.root = null;
  }

  relayout(layout);
  // Find node
  // Remove window
  // Replace parent with other sibling
  // Relayout
};

var relayout = layout => {
  // Traverse the tree and set frames
  if (!layout.root) {
    // No windows yet, do nothing
    return;
  }

  if (layout.root.isGroup) {
    layoutGroup(layout.root, layout.frame);
  } else {
    layoutMonocle(layout.root, layout.frame);
  }
};
