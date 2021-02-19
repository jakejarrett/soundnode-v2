import React from "react";
import { SoundCloudTrack } from "../../util/Soundcloud";
import { secondsToTime } from "../../util/secondsToTime";
import styled from "styled-components";
import {
  IoIosPlay,
  IoIosSkipForward,
  IoIosSkipBackward,
  IoIosPause,
} from "react-icons/io";

export interface ComponentProps {
  trackLength?: number;
  track: SoundCloudTrack | null;
  audioState: {
    currentTime: number;
    duration: number;
    playing: boolean;
  };
  onRequestNext: () => void;
  onRequestPrevious: () => void;
}

const FooterWrapper = styled.div({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100vw",
  height: "var(--footer-height)",
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  backgroundColor: "var(--footer-background)",
  paddingTop: 10,

  "& > div": {
    position: "relative",
    width: "100%",
  },
});

const ProgressBar = styled.div({
  position: "absolute",
  bottom: 10,
  background: `var(--soundcloud-orange)`,
  height: 6,
  minWidth: 0,
  borderRadius: 10,
});

const ProgressBarBackground = styled.div({
  position: "absolute",
  bottom: 10,
  background: `var(--separator-clean-color)`,
  width: "100%",
  height: 6,
  minWidth: 0,
  borderRadius: 10,
});

const CircleIndicator = styled.div({
  position: "absolute",
  top: -2,
  right: -2,
  background: `var(--soundcloud-orange)`,
  height: 10,
  width: 10,
  borderRadius: "100%",
});

const Artwork = styled.div<{ source: string; }>`

  height: var(--footer-height);
  margin-right: 10px;
  max-width: var(--footer-height);
  max-height: var(--footer-height);
  width: var(--footer-height);
  transition: transform 0.3s ease-in-out;
  transform-origin: bottom left;
  z-index: 3;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${({ source }) => source});
  background-position: center;

`;

const ProgressContainer = styled.div({
  display: "block",

  "& > p": {
    margin: 0,
  },
});

const ControlsContainer = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,

  "& > svg": {
    margin: 10,
    cursor: "pointer",

    "&:hover": {
      color: "var(--soundcloud-orange)",
    },
  },
});

const ArtworkAndTrackDetailsContainer = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  overflow: "hidden",
});

const TrackDetails = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  overflow: "hidden",
  flexWrap: "wrap",

  "& > p": {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  },
});

const Artist = styled.p({
  opacity: 0.8,
  margin: 0,
});

const Song = styled.p({
  margin: "0 0 0",
  fontSize: `var(--font-small)`,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const ProgressControlsContainer = styled.div({
  width: `100%`,
  height: `calc(100% + 10px)`,
  position: `absolute`,
  bottom: `0px`,
  display: `flex`,
  justifyContent: `space-between`,

  "& > p": {
    margin: 0,
    marginTop: 20,
  },
});

export const Footer: React.FC<ComponentProps> = ({
  audioState,
  trackLength,
  track,
  onRequestNext,
  onRequestPrevious,
}) => (
  <FooterWrapper>
    <ArtworkAndTrackDetailsContainer>
      <Artwork
        source={track ? track.artwork_url : "https://i.ytimg.com/vi/E3ncmDuV0m0/maxresdefault.jpg"}
      />
      <TrackDetails>
        <Song>
          {track != null
            ? `${track.title.replace(`${track.user.username} - `, "")}`
            : ""}
        </Song>
        <Artist>{track != null ? track.user.username : ""}</Artist>
      </TrackDetails>
    </ArtworkAndTrackDetailsContainer>
    <ProgressContainer>
      <ControlsContainer>
        <IoIosSkipBackward size={"1.3rem"} onClick={onRequestPrevious} />
        {audioState.playing ? (
          <IoIosPause size={"1.3rem"} />
        ) : (
          <IoIosPlay size={"1.3rem"} />
        )}
        <IoIosSkipForward size={"1.3rem"} onClick={onRequestNext} />
      </ControlsContainer>
      <ProgressControlsContainer>
        <p>
          {audioState.currentTime === 0
            ? "-"
            : secondsToTime(audioState.currentTime).rendered}
        </p>
        <ProgressBarBackground />
        <ProgressBar
          style={
            audioState.currentTime && trackLength
              ? { width: `${(audioState.currentTime / trackLength) * 100}%` }
              : { width: 0 }
          }
        >
          <CircleIndicator />
        </ProgressBar>
        <p>{trackLength == null ? "-" : secondsToTime(trackLength).rendered}</p>
      </ProgressControlsContainer>
    </ProgressContainer>
    <div></div>
  </FooterWrapper>
);
