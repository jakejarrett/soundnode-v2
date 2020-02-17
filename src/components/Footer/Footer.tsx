import React from 'react';
import { SoundCloudTrack } from '../../util/Soundcloud';
import { secondsToTime } from '../../util/secondsToTime';
import styled from 'styled-components';
import { IoIosPlay, IoIosSkipForward, IoIosSkipBackward, IoIosPause } from 'react-icons/io';

export interface ComponentProps {
    trackLength?: number;
    track: SoundCloudTrack | null;
    audioState: {
        currentTime: number;
        duration: number;
        playing: boolean;
    }
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

    '& > div': {
        position: 'relative',
        width: '100%',
    }
});

const ProgressBar = styled.div({
    position: 'absolute',
    bottom: 10,
    background: `var(--soundcloud-orange)`,
    height: 6,
    minWidth: 0,
    borderRadius: 10,
});

const ProgressBarBackground = styled.div({
    position: 'absolute',
    bottom: 10,
    background: `var(--separator-clean-color)`,
    width: '100%',
    height: 6,
    minWidth: 0,
    borderRadius: 10,
})

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
});

const ProgressContainer = styled.div({
    display: 'block',

    '& > p': {
        margin: 0,
    }
});

const ControlsContainer = styled.div({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,

    '& > svg': {
        margin: 10,
        cursor: 'pointer',

        '&:hover': {
            color: 'var(--soundcloud-orange)'
        }
    }
});

const ArtworkAndTrackDetailsContainer = styled.div({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
});

const TrackDetails = styled.div({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    flexWrap: 'wrap',

    '& > p': {
        textOverflow: 'ellipses',
        whiteSpace: 'nowrap',
        width: '100%',
    }
});

const Artist = styled.p({
    opacity: 0.8,
    margin: 0,
});

const Song = styled.p({
    margin: '0 0 10px'
});

export const Footer: React.FC<ComponentProps> = ({ audioState, trackLength, track }) => (
    <FooterWrapper>
        <ArtworkAndTrackDetailsContainer>
            <Artwork src={track ? track.artwork_url : 'https://i.ytimg.com/vi/E3ncmDuV0m0/maxresdefault.jpg'} />
            <TrackDetails>
                <Song>{track != null ? `${track.title.replace(`${track.user.username} - `, '')}` : ''}</Song>
                <Artist>{track != null ? track.user.username : ''}</Artist>
            </TrackDetails>
        </ArtworkAndTrackDetailsContainer>
        <ProgressContainer>
            <ControlsContainer>
                <IoIosSkipBackward size={'1.3rem'} />
                {audioState.playing ? <IoIosPause size={'1.3rem'} /> : <IoIosPlay size={'1.3rem'} />}
                <IoIosSkipForward size={'1.3rem'} />
            </ControlsContainer>
            <ProgressBarBackground />
            <ProgressBar style={audioState.currentTime && trackLength ? { width: `${audioState.currentTime / trackLength * 100}%` } : { width: 0, }}>
                <CircleIndicator />
            </ProgressBar>
        </ProgressContainer>
        <div>

            {/* <p>
                        Total time;
                    {secondsToTime(trackLength).rendered}
                    </p> */}
        </div>
    </FooterWrapper>
);