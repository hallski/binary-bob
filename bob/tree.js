var Orientation = {
  LEFT_TO_RIGHT: 0, // First child is left of second child
  TOP_TO_BOTTOM: 1, // First child is above second child
  RIGHT_TO_LEFT: 2, // First child is right of second child
  BOTTOM_TO_TOP: 3 // First child is below second child
};

// Rotation = (orientation + 1) % 4

// interface Window {
//   windowRef: number;
// }

// interface Group {
//   ratio: number; // How much of the available space is for first child
//   orientation: Orientation;
//   first: WindowNode;
//   second?: WindowNode;
// }

// Root is a Group
// When a Window is split, a Group (parent) is created with the Window put as one of it's children depending on split order
// When a Window is removed, the parent Group is removed and the remaining Window takes its place in the tree
