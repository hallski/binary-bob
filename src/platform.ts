interface GJSImports {
  gi: {
    Meta: any
    Shell: any
    GLib: any
    Gio: any
    GObject: any
    Gtk: any
    WebKit2: any
  }
  mainloop: any
}

declare const imports: GJSImports

export const Meta = imports.gi.Meta
export const Shell = imports.gi.Shell
export const Mainloop = imports.mainloop
