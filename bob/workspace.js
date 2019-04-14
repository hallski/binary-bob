const Meta = imports.gi.Meta;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Layout = Me.imports.bob.layout;

function fromMetaWorkspace(metaWorkspace, index) {
  const layout = Layout.create(metaWorkspace.get_work_area_for_monitor(0));
  const addId = metaWorkspace.connect("window-added", (_, window) => {
    const rect = window.get_frame_rect();
    log(
      `Window added to workspace ${index}: (${rect.x}, ${rect.y}, ${
        rect.width
      }, ${rect.height})`
    );

    Layout.addWindow(layout, window);
  });

  const removeId = metaWorkspace.connect("window-removed", (_, window) => {
    log(`Window removed from workspace ${index}: ${window}`);

    Layout.removeWindow(layout, window);
  });

  return {
    impl: metaWorkspace,
    layout: layout,
    connectedSignals: [addId, removeId]
  };
}

function destroy(workspace) {
  workspace.connectedSignals.forEach(signalId =>
    workspace.impl.disconnect(signalId)
  );
}
