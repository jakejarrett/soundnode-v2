import React from "react";
import styled from "styled-components";
import { WindowActions } from "../WindowActions";
import { User } from "../User";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { SoundCloud } from "../../util/Soundcloud";
import { useGtkDecorations } from "../../hooks/useGtk/useGtk";

const HeaderbarOuter = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100vw",
  height: "var(--navbar-height)",
  background:
    "linear-gradient(to bottom, var(--body-background), 10%, #101010)",
  borderTop: "2px solid var(--soundcloud-orange)",
  boxShadow: "0 0 10px 0 #000000",
  zIndex: 100,
  "-webkit-app-region": "drag",

  "& input": {
    color: "white",
    "-webkit-app-region": "no-drag",
    background: "transparent",
    border: 0,
    borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 0,
    outline: 0,
    padding: "5px 10px",
    maxWidth: 300,
    width: "100%",
    margin: "0 0 0 10px",

    "&:focus, &:active": {
      borderBottomColor: "var(--soundcloud-orange)",
    },
  },
});

const IconWrapper = styled.a({
  display: "inline-block",
  margin: "0 10px 0 0",
});

const HeaderbarInner = styled.div({
  width: "100%",
});

const IconSearch = styled.div({
  width: "100%",
  display: "flex",
  alignItems: "center",

  "& a": {
    "-webkit-app-region": "no-drag",
  },
});

interface ComponentProps {}

const get = async (url: string) => {
  const fetched = await fetch(`${url}?client_id=${SoundCloud.clientID}`);
  const json = await fetched.json();
  return json;
};

export const Headerbar: React.FC<ComponentProps> = () => {
  const [decorations] = useGtkDecorations();
  const handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value;

    if (value.includes("soundcloud:")) {
      const cleansed = value.replace(/[^0-9a-z]\:/gi, "");
      const split = cleansed.split(":");

      get(`https://api.soundcloud.com/${split[1]}/${split[2]}`).then(
        console.log
      );
    }
  };

  return (
    <HeaderbarOuter>
      {decorations === "left" && (
        <HeaderbarInner className="window-actions-left">
          <WindowActions decorations={decorations} />
        </HeaderbarInner>
      )}
      <IconSearch
        className={`${decorations === "right" ? "no-decorations-left" : ""}`}
      >
        <IconWrapper>
          <IoIosArrowBack size="1em" />
        </IconWrapper>
        <IconWrapper>
          <IoIosArrowForward size="1em" />
        </IconWrapper>
        <input placeholder="Search soundcloud" onChange={handleOnChange} />
      </IconSearch>
      <HeaderbarInner>
        <User />
      </HeaderbarInner>
      {decorations === "right" && (
        <HeaderbarInner className="window-actions-right">
          <WindowActions decorations={decorations} />
        </HeaderbarInner>
      )}
    </HeaderbarOuter>
  );
};
