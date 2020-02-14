import React from 'react';
import { SoundCloudTrack } from '../util/Soundcloud';
import { secondsToTime } from '../util/secondsToTime';
import styled from 'styled-components';

export interface ComponentProps {
    currentTime?: number;
    trackLength?: number;
    track: SoundCloudTrack | null;
}

const FooterWrapper = styled.div({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 'var(--footer-height)',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'var(--footer-background)',
    paddingTop: 10,
});

const ProgressBar = styled.div({
    position: 'absolute',
    top: 0,
    background: `var(--soundcloud-orange)`,
    height: 6,
    minWidth: 0,
});

const CircleIndicator = styled.div({
    position: 'absolute',
    top: -2,
    right: -2,
    background: `var(--soundcloud-orange)`,
    height: 10,
    width: 10,
    borderRadius: '100%',
});

const Artwork = styled.img({
    height: `var(--footer-height)`,
    maxWidth: '100%',
    marginLeft: 10,
    marginRight: 10,
})

export const Footer: React.FC<ComponentProps> = ({ currentTime, trackLength, track }) => (
    <FooterWrapper>
        {trackLength != null && currentTime != null && track != null ? (
            <>
                <ProgressBar style={{ width: `${currentTime / trackLength * 100}%` }}>
                    <CircleIndicator />
                </ProgressBar>
                <Artwork src={track.artwork_url} />
                <p>
                    Current time;
                    {secondsToTime(currentTime).rendered}
                </p>
                <p>
                    Total time;
                    {secondsToTime(trackLength).rendered}
                </p>
            </>

        ) : null}
    </FooterWrapper>
);