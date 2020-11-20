import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { hideMenu } from "react-contextmenu";

import {
  Track,
  Playlist,
  TrackRepost,
  PlaylistRepost,
  SoundCloudTrack,
  SoundCloud,
} from "../../util/Soundcloud";
import { Headerbar } from "../Headerbar";
import { Stream } from "../Stream";
import { Navigation } from "../Navigation";
import { Footer } from "../Footer";
import { useQueue } from "../../hooks/useQueue";
import { useGtk } from "../../hooks/useGtk/useGtk";

interface AudioState {
  playing: boolean;
  currentTime: number;
  duration: number;
}

/**
 * TODO: Clean up this component where possible. currently it's a massive mess.
 */
export const App: React.FC = () => {
  const [gtk] = useGtk();
  const [audioState, setAudioState] = React.useState<AudioState>({ currentTime: 0, duration: 0, playing: false, });
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<SoundCloudTrack | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = React.useState<string | undefined>();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [queue, actions] = useQueue();
  const getIndex = () => {
    let queueIndex: number | undefined;
    if (queue != null) {
      for (const index in queue) {
        if (queue[index].uuid === currentlyPlayingId) {
          queueIndex = +index;
        }
      }
    }
    return queueIndex;
  };
  const getNextSong = () => {
    console.log("next song needed");
    if (queue != null) {
      const index = getIndex();

      if (index != null) {
        const next = queue[index + 1];

        // actions.setQueue()
      }
    }
  };
  const onPlay = (entity: Track | Playlist | TrackRepost | PlaylistRepost) => {
    if (entity.uuid === currentlyPlayingId) {
      const isPlaying = audioState.playing;

      setAudioState({ ...audioState, playing: !isPlaying });

      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }

      return;
    }

    if (entity.type === "track" || entity.type === "track-repost") {
      const toGet = entity.track.media.transcodings[1].url;
      fetch(`${toGet}?client_id=${SoundCloud.clientID}`)
        .then((res) => res.json())
        .then((trackUrl) => {
          const newTrack = { ...entity.track };
          newTrack.stream_url = trackUrl.url;
          setCurrentlyPlayingId(entity.uuid);
          setCurrentlyPlaying(newTrack);
          setAudioState({
            ...audioState,
            playing: true,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // TODO: Figure out playlists.
      const track = entity.playlist.tracks[0];
      const toGet = track.media.transcodings[1].url;
      fetch(`${toGet}?client_id=${SoundCloud.clientID}`)
        .then((res) => res.json())
        .then((trackUrl) => {
          const newTrack = { ...track };
          newTrack.stream_url = trackUrl.url;
          setCurrentlyPlaying(newTrack);
          setCurrentlyPlayingId(entity.uuid);
          setAudioState({
            ...audioState,
            playing: true,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useHotkeys("ctrl+right", () => {
    if (queue != null) {
      const index = getIndex();
      console.log(index);

      if (index != null) {
        const next = queue[index + 1];
        onPlay(next);
      }
    }
  }, [queue, getIndex]);

  useHotkeys("right", () => {
    if (!!currentlyPlaying) {
      const currentTime = audioState.currentTime + 5;

      setAudioState({ ...audioState, currentTime });

      if (audioRef.current) {
        audioRef.current.currentTime = currentTime
      }

      return;
    }
  }, [audioState]);

  useHotkeys("left", () => {
    if (!!currentlyPlaying) {
      const currentTime = audioState.currentTime - 5;

      setAudioState({ ...audioState, currentTime });

      if (audioRef.current) {
        audioRef.current.currentTime = currentTime
      }

      return;
    }
  }, [audioState]);

  useHotkeys(
    "space",
    (event: KeyboardEvent) => {
      event.preventDefault();

      if (!!currentlyPlaying) {
        const isPlaying = audioState.playing;

        setAudioState({ ...audioState, playing: !isPlaying });

        if (audioRef.current) {
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
        }

        return;
      }
    },
    [audioState]
  );

  React.useEffect(() => {
    const el = document.querySelector<HTMLDivElement>("#root");
    const listener = () => hideMenu();
    if (el != null) {
      el.addEventListener("scroll", listener);
      document.addEventListener("resize", listener);
      window.addEventListener('blur', listener);
    }

    return () => {
      if (el != null) {
        el.removeEventListener("scroll", listener);
        document.removeEventListener("resize", listener);
        window.removeEventListener('blur', listener);
      }
    };
  }, []);

  React.useEffect(() => {
    if (currentlyPlaying != null) {
      console.log(queue);
      getNextSong();
    }
  }, [currentlyPlaying]);

  // React.useEffect(() => {
  // }, [gtk]);
  
  console.log(gtk.layout.buttons);
  return (
    <>
      <Headerbar />
      <div>
        <Router>
          <Navigation />
          <div>
            <Switch>
              <Route exact path="/">
                <Stream
                  onPlay={onPlay}
                  currentlyPlayingId={currentlyPlayingId}
                  isCurrentlyPlaying={audioState.playing}
                />
              </Route>
            </Switch>
          </div>
        </Router>
        <Footer
          track={currentlyPlaying}
          trackLength={audioState.duration}
          audioState={audioState}
        />
        <audio
          ref={audioRef}
          src={(currentlyPlaying && `${currentlyPlaying.stream_url}`) || ""}
          autoPlay
          onTimeUpdate={(e) =>
            setAudioState({
              ...audioState,
              currentTime: e.currentTarget.currentTime,
            })
          }
          onDurationChange={(e) =>
            setAudioState({ ...audioState, duration: e.currentTarget.duration })
          }
          onEnded={(e) => getNextSong()}
        />
      </div>
    </>
  );
};
