import React from 'react';
import logo from './logo.svg';
import { Headerbar } from '../Headerbar';
import { SoundCloud, StreamResponse } from "../util/Soundcloud"
import { Configuration } from '../util/Configuration';

export const App: React.FC = () => {
	// This is just for the purpose of debugging stream api.
	const [streamResponse, setStreamResponse] = React.useState<StreamResponse | null>(null);
	const { config } = new Configuration();
	const soundcloud = new SoundCloud(config.clientId, config.accessToken)
	soundcloud.stream.get().then(setStreamResponse);

	return (
		<>

			<Headerbar />
			<div className="App">
				<div>
					{streamResponse != null ? (
						streamResponse.collection.map(entity => {
							let title = '';
							switch (entity.type) {
								case "playlist": {
									title = entity.playlist.title;
									break;
								}
								case "playlist-repost": {
									title = entity.playlist.title + ` \n reposts: ${entity.playlist.reposts_count}`;
									break;
								}
								case "track": {
									title = entity.track.title;
									break;
								}
								case "track-repost": {
									title = entity.track.title + ` \n reposts: ${entity.track.reposts_count}`;;
									break;
								}
							}
							return <p>{title} <br /> {entity.type}</p>;
						})
					) : <p>NO TRACKS WTFFFFF</p>}
				</div>
			</div>
		</>
	);
}

