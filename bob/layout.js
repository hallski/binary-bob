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
    group.a.move_resize_frame(
      true,
      aFrame.x,
      aFrame.y,
      aFrame.width,
      aFrame.height
    );
  }

  if (group.b.isGroup) {
    layoutGroup(group.b, bFrame);
  } else {
    group.b.move_resize_frame(
      true,
      bFrame.x,
      bFrame.y,
      bFrame.width,
      bFrame.height
    );
  }
};

const layoutMonocle = (window, frame) => {
  log(`Layout monocle with frame ${Utils.frameToStr(frame)}`);
  window.move_resize_frame(true, frame.x, frame.y, frame.width, frame.height);
};

const createGroup = (a, b, orientation) => ({
  isGroup: true,
  ratio: 0.5,
  orientation: orientation,
  a: a,
  b: b
});

// Public
var addWindow = (layout, window) => {
  if (!layout.root) {
    log(`Creating a monocle window`);
    layout.root = window;
  } else {
    if (layout.root.isGroup) {
      log(`There is a group here, try to find the insertion point`);
      // Follow b until not a group
      let p = layout.root;
      let g = layout.root.b;
      while (true) {
        if (g.isGroup === undefined) {
          log("Found insertion point!");
          break;
        }
        p = g;
        g = g.b;
      }

      p.b = createGroup(g, window, !p.orientation);
    } else {
      log("Replacing monocle view with a group");
      const monocleWindow = layout.root;

      layout.root = createGroup(monocleWindow, window, false);
    }
  }

  relayout(layout);
  // Find insertion point
  // Create group
  // Add to group
  // Relayout
};

var removeWindow = (layout, window) => {
  if (layout.root === window) {
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
