import React from 'react';
import { StreamResponse } from "../util/Soundcloud"
import { useSoundCloud } from '../useSoundCloud';
import styled from 'styled-components';

const Container = styled.div({
    display: 'flex',
    flexWrap: 'wrap',
});

const Song = styled.div({
    width: 240,
    height: 'auto',
    overflow: 'hidden',
});

const Image = styled.img({
    width: 220,
    height: 220,
    borderRadius: 10,
    margin: '0 10px',
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
                {
                    streamResponse.collection.map(entity => {
                        const artwork: string = entity.type === 'track' || entity.type === 'track-repost' ?
                            entity.track.artwork_url :
                            entity.playlist.artwork_url || entity.playlist.tracks[0].artwork_url;

                        return <Song key={entity.uuid}>
                            <Image src={artwork} alt={"artwork"} />
                            <p>{entity.type}</p>
                            <p>{entity.type.includes('repost') ? 'Reposted' : 'Posted'} by {entity.user.username}</p>
                        </Song>
                    })
                }
            </Container>
        </>
    )
};