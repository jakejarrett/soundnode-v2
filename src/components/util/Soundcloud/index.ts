import { API } from "./API";
import { Apps, Comments, Me, OEmbed, Playlists, Resolve, Tracks, Users, Util, Stream } from "./entities/index";

const publicID = "BeGVhOrGmfboy1LtiHTQF6Ejpt9ULJCI";

/**
 * The main class for interacting with the Soundcloud API.
 */
export class SoundCloud {
    public static clientID: string;
    public static oauthToken: string;
    public api = new API(SoundCloud.clientID, SoundCloud.oauthToken);
    public tracks = new Tracks(this.api);
    public users = new Users(this.api);
    public playlists = new Playlists(this.api);
    public oembed = new OEmbed(this.api);
    public resolve = new Resolve(this.api);
    public me = new Me(this.api);
    public stream = new Stream(this.api);;
    public comments = new Comments(this.api);
    public apps = new Apps(this.api);
    public util = new Util(this.api);

    constructor(clientID?: string, oauthToken?: string) {
        SoundCloud.clientID = clientID || publicID;

        if (oauthToken) {
            SoundCloud.oauthToken = oauthToken;
        }

        this.api = new API(SoundCloud.clientID, SoundCloud.oauthToken);
        this.tracks = new Tracks(this.api);
        this.users = new Users(this.api);
        this.playlists = new Playlists(this.api);
        this.oembed = new OEmbed(this.api);
        this.resolve = new Resolve(this.api);
        this.me = new Me(this.api);
        this.comments = new Comments(this.api);
        this.apps = new Apps(this.api);
        this.util = new Util(this.api);
        this.stream = new Stream(this.api);
    }
}

export * from "./entities/index";
export * from "./types/index";