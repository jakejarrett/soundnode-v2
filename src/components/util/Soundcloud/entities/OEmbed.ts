import { API } from "../API"
import { SoundCloudOEmbed, SoundCloudOEmbedFilter } from "../types";

export class OEmbed {
    public constructor(private readonly api: API) { }

    /**
     * Gets the Oembed for a track, playlist, or user.
     */
    public get = async (params: SoundCloudOEmbedFilter) => {
        const response = await this.api.getWebsite(`/oembed`, params);
        return response as Promise<SoundCloudOEmbed>;
    }
}