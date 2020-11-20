import {
  NeoReact as INeoReact,
  Configuration,
  Service,
  NeoExtension,
  ComponentType,
  RenderService,
} from "./src/core";
import React from "react";

export class NeoReact<T> implements INeoReact<T> {
  private extension: NeoExtension = {};

  constructor(
    private config: Configuration<T>,
    private renderer: ReactDOM.Renderer
  ) {
    for (const key in this.config.extensions) {
      const extension = this.config.extensions[key];
      extension.func(this.extension);
    }
  }

  add(service: Service<T>) {}

  create() {}

  public render() {
    const component =
      typeof this.config.component === "function"
        ? this.config.component({})
        : this.config.component;

    this.renderer(component, document.querySelector(this.config.target));

    let renderByService: RenderService = {};

    for (const service of this.config.services) {
      console.log(service);
      for (const zone of service.zones) {
        console.log(service.state);
        renderByService = {
          ...renderByService,
          [zone.target]: {
            ...renderByService[zone.target],
            [zone.name]: {
              service: service.name,
              component: zone.component,
              order: zone.order,
            },
          },
        };
      }
    }

    for (const service in renderByService) {
      const zoneValue = Object.values(renderByService[service]);
      let comp: JSX.Element[] = [];
      const els = document.querySelector(service);
      for (const zone of zoneValue) {
        if (typeof zone.component === "function") {
          comp.push(zone.component({}));
        } else {
          comp.push(zone.component);
        }
      }
      this.renderer(comp, els);
    }

    console.log(renderByService);
  }
}
