import React from 'react';
import { Track, Playlist, TrackRepost, PlaylistRepost } from "../util/Soundcloud";
import styled from "styled-components";

const SongComponent = styled.div({
    width: 240,
    height: 'auto',
    overflow: 'hidden',
});

const Artwork = styled.img({
    width: 220,
    height: 220,
    borderRadius: 10,
    margin: '0 10px',
});

interface ComponentProps {
    entity: Track | Playlist | TrackRepost | PlaylistRepost;
}

export const Song: React.FC<ComponentProps> = ({ entity }) => {
    const artwork: string = entity.type === 'track' || entity.type === 'track-repost' ?
        entity.track.artwork_url :
        entity.playlist.artwork_url || entity.playlist.tracks[0].artwork_url;

    return (
        <SongComponent key={entity.uuid}>
            <Artwork src={artwork.replace('-large.', '-t200x200.')} alt={"artwork"} />
            <p>{entity.type}</p>
            <p>{entity.type.includes('repost') ? 'Reposted' : 'Posted'} by {entity.user.username}</p>
        </SongComponent>
    );
}