import { API } from "../API"
import { StreamResponse } from "../types";

export class Stream {
    public constructor(private readonly api: API) { }

    /**
     * Gets your app connections, id any.
     */
    public get = async (): Promise<StreamResponse> => {
        const response = await this.api.get(`/stream`, { mode: 'no-cors', limit: 30 });
        return response;
    }

}