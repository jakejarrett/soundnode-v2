import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Track, Playlist, TrackRepost, PlaylistRepost, SoundCloudTrack, SoundCloud } from "../../util/Soundcloud";
import { Headerbar } from '../Headerbar';
import { Stream } from '../Stream';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

interface AudioState {
	playing: boolean;
	currentTime: number;
	duration: number;
}

export const App: React.FC = () => {
	const [audioState, setAudioState] = React.useState<AudioState>({ currentTime: 0, duration: 0, playing: false });
	const [currentlyPlaying, setCurrentlyPlaying] = React.useState<SoundCloudTrack | null>(null);
	const [currentlyPlayingId, setCurrentlyPlayingId] = React.useState<string | undefined>();
	const audioRef = React.useRef<HTMLAudioElement | null>(null);
	const getNextSong = () => {
		console.log('next song needed');
	}
	const onPlay = (entity: Track | Playlist | TrackRepost | PlaylistRepost) => {
		if (entity.uuid === currentlyPlayingId) {
			const isPlaying = audioState.playing;

			setAudioState({ ...audioState, playing: !isPlaying });

			if (audioRef.current) {
				if (isPlaying) {
					audioRef.current.pause();
				} else {
					audioRef.current.play();
				}
			}

			return;
		}

		if (entity.type === 'track' || entity.type === 'track-repost') {
			const toGet = entity.track.media.transcodings[1].url;
			fetch(`${toGet}?client_id=${SoundCloud.clientID}`).then(res => res.json()).then(trackUrl => {
				const newTrack = { ...entity.track };
				newTrack.stream_url = trackUrl.url;
				setCurrentlyPlayingId(entity.uuid);
				setCurrentlyPlaying(newTrack);
				setAudioState({
					...audioState,
					playing: true
				});
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
				setCurrentlyPlayingId(entity.uuid);
				setAudioState({
					...audioState,
					playing: true
				});
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
			<div>
				<Router>
					<Navigation />
					<div>

						<Switch>
							<Route exact path="/">
								<Stream onPlay={onPlay} currentlyPlayingId={currentlyPlayingId} isCurrentlyPlaying={audioState.playing} />
							</Route>
						</Switch>

					</div>
				</Router>
				<Footer currentTime={audioState.currentTime} track={currentlyPlaying} trackLength={audioState.duration} />
				<audio
					ref={audioRef}
					src={currentlyPlaying && `${currentlyPlaying.stream_url}` || ''}
					autoPlay
					onTimeUpdate={e => setAudioState({ ...audioState, currentTime: e.currentTarget.currentTime })}
					onDurationChange={e => setAudioState({ ...audioState, duration: e.currentTarget.duration })}
					onEnded={e => getNextSong()}
				/>
			</div>
		</>
	);
}

