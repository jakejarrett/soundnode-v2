import React from 'react';
import globalHook, { Store } from 'use-global-hook';
import { Track, TrackRepost, Playlist, PlaylistRepost } from '../../util/Soundcloud';

type Queue = (Track | TrackRepost | Playlist | PlaylistRepost)[];
interface Actions {
	setQueue: (queue: Queue | null) => void;
}

export const useQueue = globalHook<Queue | null, Actions>(React, null, {
	setQueue: (store: Store<Queue | null, Actions>, tracks: Queue | null) => {
		store.setState(tracks);
	}
});