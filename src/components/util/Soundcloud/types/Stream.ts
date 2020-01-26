import { SoundCloudTrack } from "./Track";
import { SoundCloudUser } from "./User";
import { SoundCloudPlaylist } from "./Playlist";

export interface StreamCommon {
    created_at: string;
    user: SoundCloudUser;
    uuid: string;
}

export type TrackCommon = StreamCommon & { track: SoundCloudTrack; }

export type TrackRepost = TrackCommon & { type: "track-repost"; }

export type Track = TrackCommon & { type: "track"; }

export type PlaylistCommon = StreamCommon & { playlist: SoundCloudPlaylist; }
export type Playlist = PlaylistCommon & { type: "playlist" };
export type PlaylistRepost = PlaylistCommon & { type: "playlist-repost" };

export interface StreamResponse {
    collection: (Track | TrackRepost | Playlist | PlaylistRepost)[],
    next_href: string,
    query_urn: null
}