import React, { useState, useEffect } from "react";
import { GtkTheme, GtkData } from "@jakejarrett/gtk-theme";

const gtk = new GtkTheme({
  events: {},
});

export const useGtk = () => {
  const [soundcloud] = useState<GtkTheme>(gtk);

  return soundcloud;
};

export const useGtkDecorations = () => {
  const [gtkDecorations, setDecorations] = useState<"left" | "right">("right");

  gtk.on.layoutChange = (data: GtkData) => setDecorations(data.layout.buttons);

  return [gtkDecorations];
};
