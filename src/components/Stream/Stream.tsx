import React, { FC, useState } from "react";

import {
  StreamResponse,
  Track,
  Playlist,
  TrackRepost,
  PlaylistRepost,
} from "../../util/Soundcloud";
import { useSoundCloud } from "../../hooks/useSoundCloud";
import styled from "styled-components";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Song } from "../Song";
import { useQueue } from "../../hooks/useQueue";

const Container = styled(InfiniteScroll as unknown as any)({
  display: "flex",
  flexWrap: "wrap",
});

interface ComponentProps {
  onPlay: (entity: Track | Playlist | TrackRepost | PlaylistRepost) => void;
  currentlyPlayingId?: string;
  isCurrentlyPlaying: boolean;
}

const unique = new Set();

export const Stream: FC<ComponentProps> = ({
  onPlay,
  currentlyPlayingId,
  isCurrentlyPlaying,
}) => {
  const soundcloud = useSoundCloud();
  const [
    streamResponse,
    setStreamResponse,
  ] = useState<StreamResponse["collection"] | undefined>();
  const [_, actions] = useQueue();

  React.useEffect(() => {
    soundcloud.stream.get().then((res) => {
      const ids =
        streamResponse == null
          ? []
          : streamResponse?.map((entity) =>
            entity.type === "track" || entity.type === "track-repost"
              ? entity.track.id
              : entity.playlist.id
          );

      for (const id of ids) {
        unique.add(id);
      }

      const tracks = res?.collection?.filter((entity) => {
        const id = entity.type === "track" || entity.type === "track-repost" ? entity.track.id : entity.playlist.id;
        const isUnique = !unique.has(id);

        if (!isUnique) {
          unique.delete(id);
        }

        return isUnique;
      })
      setStreamResponse(tracks);
      actions.setQueue(
        tracks?.filter((entity) => entity.type.includes("track"))
      );
    });
  }, [soundcloud.stream]);

  return !streamResponse ? null : (
    <>
      <h1>Stream</h1>
      <p>
        Playlists:{" "}
        {
          streamResponse?.filter((entity) =>
            entity.type.includes("playlist")
          ).length
        }{" "}
        Tracks:{" "}
        {
          streamResponse?.filter((entity) =>
            entity.type.includes("track")
          ).length
        }{" "}
        Reposts{" "}
        {
          streamResponse?.filter((entity) =>
            entity.type.includes("repost")
          ).length
        }{" "}
        Non-Reposts:{" "}
        {
          streamResponse?.filter(
            (entity) => !entity.type.includes("repost")
          ).length
        }
      </p>
      <Container
        dataLength={streamResponse?.length} //This is important field to render the next data
        next={() => {
          // soundcloud.stream.next().then(res => {
          //   const ids =
          //     streamResponse == null
          //       ? []
          //       : streamResponse?.map((entity) =>
          //         entity.type === "track" || entity.type === "track-repost"
          //           ? entity.track.id
          //           : entity.playlist.id
          //       );

          //   for (const id of ids) {
          //     unique.add(id);
          //   }

          //   const tracks = res.collection.filter((entity) => {
          //     const id = entity.type === "track" || entity.type === "track-repost" ? entity.track.id : entity.playlist.id;
          //     const isUnique = !unique.has(id);

          //     if (!isUnique) {
          //       unique.delete(id);
          //     }

          //     return isUnique;
          //   })
          //   setStreamResponse(streamResponse?.concat(tracks));
          //   actions.setQueue(
          //     tracks.filter((entity) => entity.type.includes("track"))
          //   );
          // });
        }}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        scrollableTarget="root"
      >
        {streamResponse?.map((entity) => (
          <Song
            key={entity.uuid}
            entity={entity}
            // onClickPlay={onPlay}
            // currentlyPlayingId={currentlyPlayingId}
            // isCurrentlyPlaying={isCurrentlyPlaying}
          />
        ))}
      </Container>
    </>
  );
};
