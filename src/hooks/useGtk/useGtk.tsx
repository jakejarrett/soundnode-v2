import { useState } from "react";
import { GtkTheme, GtkData } from "@jakejarrett/gtk-theme";

const gtk = new GtkTheme({
  events: {},
});

export const useGtk = () => {
  const [gtkTheme, setGtkTheme] = useState<GtkData>(gtk.getTheme());

  gtk.on.themeChange = (data: GtkData) => setGtkTheme(data);

  return [gtkTheme];
};

export const useGtkDecorations = () => {
  const [gtkDecorations, setDecorations] = useState<"left" | "right">("right");

  gtk.on.layoutChange = (data: GtkData) => setDecorations(data.layout.buttons);

  return [gtkDecorations];
};
