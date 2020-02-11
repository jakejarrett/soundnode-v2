import React from 'react';

import { StreamResponse, Track, Playlist, TrackRepost, PlaylistRepost } from "../util/Soundcloud"
import { useSoundCloud } from '../useSoundCloud';
import styled from 'styled-components';
import { Song } from '../Song';

const Container = styled.div({
    display: 'flex',
    flexWrap: 'wrap',
});

interface ComponentProps {
    onPlay: (entity: Track | Playlist | TrackRepost | PlaylistRepost) => void;
}

export const Stream: React.FC<ComponentProps> = ({ onPlay }) => {
    const soundcloud = useSoundCloud();
    const [streamResponse, setStreamResponse] = React.useState<StreamResponse | null>(null);
    const ids = streamResponse == null ? [] : streamResponse.collection.map(entity => entity.type === 'track' || entity.type === 'track-repost' ? entity.track.id : entity.playlist.id);
    const unique = new Set(ids);

    React.useEffect(() => {
        soundcloud.stream.get().then(setStreamResponse);
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
                }).map(entity => <Song entity={entity} onClickPlay={onPlay} />)}
            </Container>
        </>
    )
};