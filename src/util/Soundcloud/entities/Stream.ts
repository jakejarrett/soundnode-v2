import { API } from "../API"
import { StreamResponse } from "../types";

export class Stream {
    public constructor(private readonly api: API) { }

    _nextUrl: string | undefined;

    /**
     * Gets your app connections, id any.
     */
    public get = async (): Promise<StreamResponse> => {
        const response = await this.api.get(`/stream`, { limit: 30 });
        this._nextUrl = response.next_href;
        return response;
    }

    /**
     * Gets your app connections, id any.
     */
    public next = async (): Promise<StreamResponse> => {
        const nextUrl = this._nextUrl?.split("/stream")[1] ?? "";
        const response = await this.api.get(`/stream${nextUrl}`, { limit: 30 });
        this._nextUrl = response.next_href;
        return response;
    }

}