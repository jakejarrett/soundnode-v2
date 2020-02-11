import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import { Track, Playlist, TrackRepost, PlaylistRepost, SoundCloudTrack, SoundCloud } from "../util/Soundcloud";
import { Headerbar } from '../Headerbar';
import { Stream } from '../Stream';
import { Navigation } from '../Navigation';
import { useSoundCloud } from '../useSoundCloud';

export const App: React.FC = () => {
	const [currentlyPlaying, setCurrentlyPlaying] = React.useState<SoundCloudTrack | null>(null);
	const [currentlyPlayingId, setCurrentlyPlayingId] = React.useState<string | undefined>();
	const onPlay = (entity: Track | Playlist | TrackRepost | PlaylistRepost) => {
		setCurrentlyPlayingId(entity.uuid);
		if (entity.type === 'track' || entity.type === 'track-repost') {
			const toGet = entity.track.media.transcodings[1].url;
			fetch(`${toGet}?client_id=${SoundCloud.clientID}`).then(res => res.json()).then(trackUrl => {
				const newTrack = { ...entity.track };
				newTrack.stream_url = trackUrl.url;
				setCurrentlyPlaying(newTrack);
			}).catch(err => {
				console.error(err);
			});
		} else {
			// TODO: Figure out playlists.
			const track = entity.playlist.tracks[0];
			const toGet = track.media.transcodings[1].url;
			fetch(`${toGet}?client_id=${SoundCloud.clientID}`).then(res => res.json()).then(trackUrl => {
				const newTrack = { ...track };
				newTrack.stream_url = trackUrl.url;
				setCurrentlyPlaying(newTrack);
			}).catch(err => {
				console.error(err);
			});
		}
	}

	React.useEffect(() => {
		console.log(currentlyPlaying);
	}, [currentlyPlaying]);
	return (
		<>
			<Headerbar />
			<div className="App">
				<Router>
					<Navigation />
					<div>

						<Switch>
							<Route exact path="/">
								<Stream onPlay={onPlay} currentlyPlayingId={currentlyPlayingId} />
							</Route>
						</Switch>

					</div>
				</Router>
				<audio src={currentlyPlaying && `${currentlyPlaying.stream_url}` || ''} autoPlay />
			</div>
		</>
	);
}

