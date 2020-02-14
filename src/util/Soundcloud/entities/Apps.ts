import { API } from "../API"
import { SoundCloudApp } from "../types";

export class Apps {
    public constructor(private readonly api: API) { }

    /**
     * Gets Soundcloud apps.
     */
    public get = async () => {
        const response = await this.api.get(`/apps`);
        return response as Promise<SoundCloudApp[]>;
    }
}