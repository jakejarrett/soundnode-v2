import { API } from "../API"
import { SoundCloudPlaylist, SoundCloudPlaylistFilter, SoundCloudSecretToken } from "../types";
import { Resolve } from "./Resolve";

export class Playlists {
    private readonly resolve = new Resolve(this.api);
    public constructor(private readonly api: API) { }

    /**
     * Searches for playlists.
     */
    public search = async (params?: SoundCloudPlaylistFilter) => {
        const response = await this.api.get(`/playlists`, params);
        return response as Promise<SoundCloudPlaylist[]>;
    }

    /**
     * Fetches a playlist from URL or ID.
     */
    public get = async (playlistResolvable: string | number): Promise<SoundCloudPlaylist> => {
        const playlistID = await this.resolve.get(playlistResolvable, true);

        if (playlistID.hasOwnProperty("id")) {
            return playlistID;
        }

        return await this.api.get(`/playlists/${playlistID}`);
    }

    /**
     * Requires Authentication - Gets the secret token from one of your playlists.
     */
    public secretToken = async (playlistResolvable: string | number): Promise<SoundCloudSecretToken> => {
        const playlistID = await this.resolve.get(playlistResolvable);

        return await this.api.get(`/playlists/${playlistID}/secret-token`)
            .catch(() => Promise.reject("Oauth Token is required for this endpoint."));
    }
}