const Meta = imports.gi.Meta;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Workspace = Me.imports.bob.workspace;

function getWorkspaceManager() {
  return global.workspace_manager;
}

function getMonitorManager() {
  return Meta.MonitorManager.get();
}

function getDisplay() {
  return global.display;
}

function create() {
  const managedWorkspaces = [];
  // TODO: Ignore workspace 0 for now, makes it easier to develop until I get somewhere stablish
  for (let id = 0; id < getWorkspaceManager().get_n_workspaces(); ++id) {
    managedWorkspaces.push(
      Workspace.fromMetaWorkspace(
        getWorkspaceManager().get_workspace_by_index(id),
        id
      )
    );
  }

  // TODO: Implement to update managedWorkspaces
  getWorkspaceManager().connect("workspace-added", (_, id) => {
    log(`Workspace added: ${id}`);
  });

  // TODO: Implement to update managedWorkspaces
  getWorkspaceManager().connect("workspace-removed", (_, id) => {
    log(`Workspace removed: ${id}`);
  });

  global.display.connect("notify::focus-window", (display, window) => {
    log(`Window focused on display ${display}: ${window}`);
  });

  return {
    workspaces: managedWorkspaces
  };
}

function destroy(wm) {
  wm.workspaces.forEach(Workspace.destroy);
}

// Signals:
// workspace.connect("window-created", (workspace, window))
// workspace.connect("window-removed", (workspace, window))
// screen.connect("window-entered-monitor", (screen, monitorId, window))
// screen.connect("window-left-monitor", (screen, monitorId, window))
// screen.connect("noitify::focus-window", display, window)
// //
