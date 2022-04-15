import { useState } from "react";
import { GtkTheme, GtkData } from "@jakejarrett/gtk-theme";
import { platform } from 'process';

let gtk: GtkTheme | undefined = undefined;

if (platform === 'linux') {
  gtk = new GtkTheme({
    events: {},
  });
}

export const useGtk = () => {
  const [gtkTheme, setGtkTheme] = useState<GtkData | undefined>(gtk?.getTheme());

  if (gtk) {
    gtk.on.themeChange = (data: GtkData) => setGtkTheme(data);
  }

  return gtkTheme;
};

export const useGtkDecorations = () => {
  const [gtkDecorations, setDecorations] = useState<"left" | "right">("right");

  if (gtk) {
    gtk.on.layoutChange = (data: GtkData) => setDecorations(data.layout.buttons);
  }

  return gtkDecorations;
};
