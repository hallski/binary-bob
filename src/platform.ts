interface GJS_Imports {
  gi: {
    Meta: any;
    Shell: any;
    GLib: any;
    Gio: any;
    GObject: any;
    Gtk: any;
    WebKit2: any;
  };
}

declare const imports: GJS_Imports;

export const Meta = imports.gi.Meta;
export const Shell = imports.gi.Shell;
