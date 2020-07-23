import React from 'react';
import {
	List,
	CellMeasurer,
	CellMeasurerCache,
	InfiniteLoader,
	AutoSizer
  } from 'react-virtualized';

import { StreamResponse, Track, Playlist, TrackRepost, PlaylistRepost } from "../../util/Soundcloud"
import { useSoundCloud } from '../../hooks/useSoundCloud';
import styled from 'styled-components';
import { Song } from '../Song';
import { useQueue } from '../../hooks/useQueue';

const Container = styled.div({
	display: 'flex',
	flexWrap: 'wrap',
});

interface ComponentProps {
	onPlay: (entity: Track | Playlist | TrackRepost | PlaylistRepost) => void;
	currentlyPlayingId?: string;
	isCurrentlyPlaying: boolean;
}

export const Stream: React.FC<ComponentProps> = ({ onPlay, currentlyPlayingId, isCurrentlyPlaying }) => {
	const soundcloud = useSoundCloud();
	const [streamResponse, setStreamResponse] = React.useState<StreamResponse | null>(null);
	const ids = streamResponse == null ? [] : streamResponse.collection.map(entity => entity.type === 'track' || entity.type === 'track-repost' ? entity.track.id : entity.playlist.id);
	const unique = new Set(ids);
	const tracks = streamResponse != null ? streamResponse.collection.filter(entity => entity.type.includes('track')) : [];
	const [queue, actions] = useQueue();

	React.useEffect(() => {
		soundcloud.stream.get().then(res => {
			setStreamResponse(res);
			actions.setQueue(res.collection.filter(entity => entity.type.includes('track')));
		});
	}, [soundcloud.stream]);

	return streamResponse == null ? null : (
		<>
			<h1>Stream</h1>
			<p>
				Playlists: {streamResponse.collection.filter(entity => entity.type.includes('playlist')).length}{' '}
				Tracks: {streamResponse.collection.filter(entity => entity.type.includes('track')).length}{' '}
				Reposts {streamResponse.collection.filter(entity => entity.type.includes('repost')).length}{' '}
				Non-Reposts: {streamResponse.collection.filter(entity => !entity.type.includes('repost')).length}
			</p>
			<Container>
				{streamResponse.collection.filter(entity => {
					const id = entity.type === 'track' || entity.type === 'track-repost' ? entity.track.id : entity.playlist.id
					if (unique.has(id)) {
						unique.delete(id);
						return true;
					}
					return false;
				}).map(entity => <Song entity={entity} onClickPlay={onPlay} currentlyPlayingId={currentlyPlayingId} isCurrentlyPlaying={isCurrentlyPlaying} />)}
			</Container>
		</>
	)
};