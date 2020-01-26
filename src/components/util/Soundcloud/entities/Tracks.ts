import { API } from "../API"
import { SoundCloudComment, SoundCloudSecretToken, SoundCloudTrack, SoundCloudTrackFilter, SoundCloudUser } from "../types"
import { Resolve } from "./Resolve"

export class Tracks {

    private readonly resolve = new Resolve(this.api);

    public constructor(private readonly api: API) { }

    /**
     * Searches for tracks.
     * 
     * TODO: Add type.
     */
    public search = async (params?: SoundCloudTrackFilter) => {
        return await this.api.get(`/tracks`, params)
    }

    /**
     * Fetches a track by URL or ID.
     */
    public get = async (trackResolvable: string | number): Promise<SoundCloudTrack> => {
        const id = await this.resolve.get(trackResolvable, true);
        if (id.hasOwnProperty("id")) return id;
        return await this.api.get(`/tracks/${id}`);
    }

    /**
     * Fetches all comments on a track.
     */
    public comments = async (trackResolvable: string | number): Promise<SoundCloudComment[]> => {
        const trackID = await this.resolve.get(trackResolvable);
        return await this.api.get(`/tracks/${trackID}/comments`);
    }

    /**
     * Gets a specific comment.
     */
    public comment = async (trackResolvable: string | number, commentID: number): Promise<SoundCloudComment> => {
        const trackID = await this.resolve.get(trackResolvable);
        return await this.api.get(`/tracks/${trackID}/comments/${commentID}`);
    }

    /**
     * Get all users who favorited the track.
     */
    public favoriters = async (trackResolvable: string | number): Promise<SoundCloudUser[]> => {
        const trackID = await this.resolve.get(trackResolvable)
        return await this.api.get(`/tracks/${trackID}/favoriters`)
    }

    /**
     * Get a specific favoriter.
     */
    public favoriter = async (trackResolvable: string | number, userResolvable: string | number): Promise<SoundCloudUser> => {
        const trackID = await this.resolve.get(trackResolvable)
        const userID = await this.resolve.get(userResolvable)
        return await this.api.get(`/tracks/${trackID}/favoriters/${userID}`);
    }

    /**
     * Requires Authentication - Gets the secret token from one of your own tracks.
     */
    public secretToken = async (trackResolvable: string | number): Promise<SoundCloudSecretToken> => {
        const trackID = await this.resolve.get(trackResolvable)

        return await this.api.get(`/tracks/${trackID}/secret-token`)
            .catch(() => Promise.reject("Oauth Token is required for this endpoint."))
    }

}