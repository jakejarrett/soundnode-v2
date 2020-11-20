import { NeoReact } from "./neoreact";

declare global {
    interface Window { conductor: NeoReact<any>; }
};

