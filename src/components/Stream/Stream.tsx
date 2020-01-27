import React from 'react';
import { StreamResponse } from "../util/Soundcloud"
import { useSoundCloud } from '../useSoundCloud';
import styled from 'styled-components';
import { Song } from '../Song';

const Container = styled.div({
    display: 'flex',
    flexWrap: 'wrap',
});

export const Stream = () => {
    const soundcloud = useSoundCloud();
    const [streamResponse, setStreamResponse] = React.useState<StreamResponse | null>(null);

    React.useEffect(() => {
        soundcloud.stream.get().then(setStreamResponse);
    }, [soundcloud.stream]);

    return streamResponse == null ? null : (
        <>
            <h1>Stream</h1>
            <p>
                Playlists: {streamResponse.collection.filter(entity => entity.type.includes('playlist')).length}{' '}
                Tracks: {streamResponse.collection.filter(entity => entity.type.includes('track')).length}
            </p>
            <Container>
                {streamResponse.collection.map(entity => <Song entity={entity} />)}
            </Container>
        </>
    )
};