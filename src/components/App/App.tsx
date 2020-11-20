import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import { hideMenu } from "react-contextmenu";

import { Track, Playlist, TrackRepost, PlaylistRepost, SoundCloudTrack, SoundCloud } from "../../util/Soundcloud";
import { Headerbar } from '../Headerbar';
import { Stream } from '../Stream';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';
import { useQueue } from '../../hooks/useQueue';

interface AudioState {
	playing: boolean;
	currentTime: number;
	duration: number;
}

/**
 * TODO: Clean up this component where possible. currently it's a massive mess.
 */
export const App: React.FC = () => {
	React.useEffect(() => {
		const el = document.querySelector<HTMLDivElement>('#root');
		const listener = () => hideMenu();
		if (el != null) {
			el.addEventListener('scroll', listener);
			document.addEventListener('resize', listener);
		}

		return () => {
			if (el != null) {
				el.removeEventListener('scroll', listener);
				document.removeEventListener('resize', listener);
			}
		}
	}, []);

	return (
		<>
			<Headerbar />
			<div>
				<Router>
					<Navigation />
					<div>

						<Switch>
							<Route exact path="/">
								<Stream />
							</Route>
						</Switch>

					</div>
				</Router>
				<div id="player" />
			</div>
		</>
	);
}

