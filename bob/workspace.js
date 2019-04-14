const Meta = imports.gi.Meta;

function fromMetaWorkspace(metaWorkspace, index) {
  const addId = metaWorkspace.connect("window-added", (_, window) => {
    const rect = window.get_frame_rect();
    log(
      `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
        rect.width
      }, ${rect.height})`
    );
  });

  const removeId = metaWorkspace.connect("window-removed", (_, window) => {
    log(`Window removed from workspace ${index}: ${window}`);
  });

  return {
    impl: metaWorkspace,

    connectedSignals: [addId, removeId]
  };
}

function destroy(workspace) {
  workspace.connectedSignals.forEach(signalId =>
    workspace.impl.disconnect(signalId)
  );
}
