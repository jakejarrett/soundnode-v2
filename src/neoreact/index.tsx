import {
  NeoReact as INeoReact,
  Configuration,
  Service,
  NeoExtension,
  ComponentType,
  RenderService
} from "./src/core";

export class NeoReact<T> implements INeoReact<T> {
  private extension: NeoExtension = {
    utility: [],
  };

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
    let component;
    if (typeof this.config.component === "function") {
      component = this.config.component({});
    } else {
      component = this.config.component;
    }
    this.renderer(component, document.querySelector(this.config.target));

    let renderByService: RenderService = {};

    for (const service of this.config.services) {
      for (const zone of service.zones) {
        renderByService = {
          ...renderByService,
          [zone.target]: {
            ...renderByService[zone.target],
            [zone.name]: {
              service: service.name,
              component: zone.component,
              order: zone.order
            }
          }
        };
      }
    }

    for (const service in renderByService) {
      const zoneValue = Object.values(renderByService[service]).sort((first, second) => first.order - second.order);
      let comp: JSX.Element[] = [];
      const els = document.querySelector(service);
      for (const zone of zoneValue) {
        if (typeof zone.component === "function") {
          comp.push(zone.component({ extensions: this.config.extensions }));
        } else {
          comp.push(zone.component);
        }
      }
      this.renderer(comp, els);
    }
  }
}
