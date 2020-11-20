import React from "react";
import {
  Track,
  Playlist,
  TrackRepost,
  PlaylistRepost,
} from "../../util/Soundcloud";
import {
  IoIosRepeat,
  IoIosMusicalNote,
  IoIosPlay,
  IoIosHeart,
  IoIosPause,
} from "react-icons/io";
import { MdPlaylistPlay } from "react-icons/md";
import styled from "styled-components";
import approximateNumber from "approximate-number";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { clipboard, shell } from "electron";

const SongComponent = styled.div({
  width: `calc(280px - 20px)`,
  height: "auto",
  overflow: "hidden",
  background: "rgba(0, 0, 0, 0.5)",
  margin: 10,
  borderRadius: 10,
  boxShadow: "0 10px 20px -10px rgba(0, 0, 0, 1)",
});

const Artwork = styled.div({
  position: "relative",
  overflow: "hidden",
  width: 260,
  height: 260,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
});

const SongTitle = styled.div({
  display: "flex",
  alignContent: "center",
  overflow: "hidden",
  maxWidth: "100%",
  padding: 5,

  "& p": {
    textOverflow: "ellipsis",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: "0.9rem",
  },

  "& svg": {
    minHeight: "1.5em",
    minWidth: "1.5em",
    marginRight: 5,
  },
});

const SongStats = styled.div({
  display: "flex",
  alignContent: "center",
  alignItems: "center",
  overflow: "hidden",
  maxWidth: "100%",
  padding: 5,

  "& p": {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    overflow: "hidden",
    maxWidth: "100%",
    textOverflow: "ellipsis",
    margin: 0,
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
    marginRight: 5,
  },

  "& svg": {
    marginRight: 5,
  },
});

const SongCover = styled.div({
  width: "100%",
  position: "absolute",
  height: "100%",
  opacity: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",

  "&:hover": {
    opacity: 1,
  },

  "&.active": {
    opacity: 1,
  },
});

interface ComponentProps {
  entity: Track | Playlist | TrackRepost | PlaylistRepost;
  // onClickPlay: (entity: Track | Playlist | TrackRepost | PlaylistRepost) => void;
  // currentlyPlayingId?: string;
  // isCurrentlyPlaying: boolean;
}

export const Song: React.FC<ComponentProps> = ({
  entity,
  //   onClickPlay,
  //   currentlyPlayingId,
  //   isCurrentlyPlaying,
}) => {
  const onClickPlay = (ent: any) => null;
  const currentlyPlayingId = "";
  const isCurrentlyPlaying = false;
  const artwork: string =
    entity.type === "track" || entity.type === "track-repost"
      ? entity.track.artwork_url || entity.track.user.avatar_url
      : entity.playlist.artwork_url || entity.playlist.tracks[0].artwork_url;
  const isRepost = entity.type.includes("repost");
  const title =
    entity.type === "track" || entity.type === "track-repost"
      ? `${entity.track.title} - ${entity.track.user.username}`
      : `${entity.playlist.title} (${entity.playlist.user.username})`;

  const url =
    entity.type === "track" || entity.type === "track-repost"
      ? entity.track.permalink_url
      : entity.playlist.permalink_url;
  const urn =
    entity.type === "track" || entity.type === "track-repost"
      ? entity.track.urn
      : entity.playlist.uri;

  return (
    <div style={{ position: "relative" }}>
      <ContextMenuTrigger id={title}>
        <SongComponent
          key={entity.uuid}
          onContextMenu={(e) => console.log(entity)}
        >
          <Artwork
            style={{
              backgroundImage: `url(${
                artwork == null ? "" : artwork.replace("-large.", "-t200x200.")
              })`,
            }}
          >
            <SongCover
              onClick={(e) => onClickPlay(entity)}
              className={currentlyPlayingId === entity.uuid ? "active" : ""}
            >
              {currentlyPlayingId === entity.uuid && isCurrentlyPlaying ? (
                <IoIosPause size="3rem" />
              ) : (
                <IoIosPlay size="3rem" />
              )}
            </SongCover>
          </Artwork>
          <SongTitle>
            <p title={title}>{title}</p>
          </SongTitle>
          <SongTitle>
            {isRepost ? (
              <IoIosRepeat size="1.5rem" color="var(--soundcloud-orange)" />
            ) : (
              <IoIosMusicalNote
                size="1.5rem"
                color="var(--soundcloud-orange)"
              />
            )}
            <p title={entity.user.username}>{entity.user.username}</p>
          </SongTitle>
          <SongStats>
            {entity.type === "track" || entity.type === "track-repost" ? (
              <>
                <p title={`${entity.track.playback_count} Plays`}>
                  <IoIosPlay size="1.2rem" color="var(--soundcloud-orange)" />
                  {approximateNumber(entity.track.playback_count, {
                    round: true,
                    capital: true,
                  })}
                </p>
                <p title={`${entity.track.likes_count} Likes`}>
                  <IoIosHeart size="1.2rem" color="var(--soundcloud-orange)" />
                  {approximateNumber(entity.track.likes_count, {
                    round: true,
                    capital: true,
                  })}
                </p>
              </>
            ) : (
              <>
                <p title={`${entity.playlist.track_count} Tracks in playlist`}>
                  <MdPlaylistPlay
                    size="1.2rem"
                    color="var(--soundcloud-orange)"
                  />
                  {approximateNumber(entity.playlist.track_count, {
                    round: true,
                    capital: true,
                  })}
                </p>
                <p title={`${entity.playlist.likes_count} Likes`}>
                  <IoIosHeart size="1.2rem" color="var(--soundcloud-orange)" />
                  {approximateNumber(entity.playlist.likes_count, {
                    round: true,
                    capital: true,
                  })}
                </p>
              </>
            )}
          </SongStats>
        </SongComponent>
      </ContextMenuTrigger>

      <ContextMenu id={title}>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            clipboard.writeText(url);
          }}
        >
          Copy {entity.type.replace("-repost", "")} URL
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            clipboard.writeText(urn);
          }}
        >
          Copy {entity.type.replace("-repost", "")} URN
        </MenuItem>
        <hr />
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal(url);
          }}
        >
          Open {entity.type.replace("-repost", "")} in browser
        </MenuItem>
      </ContextMenu>
    </div>
  );
};
