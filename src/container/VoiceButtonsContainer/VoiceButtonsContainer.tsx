import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import ButtonSectionContainer from "../ButtonSectionContainer/ButtonSectionContainer";

import { VoiceList, useAppState } from "../../state/AppState";
import { StopAudioAction } from "../../actions/PlayAudioActions";
import AudioControllerContainer from "../AudioControllerContainer.tsx/AudioControllerContainer";

import { useDidMount } from "src/hooks/useClassComponentLikeLifeCycle";
import { ClientRenderedAction } from "src/actions/AppActions";
import { usePlayAudioState } from "src/state/PlayAudioState";

type Props = {
  voiceList: VoiceList;
};

export default (props: Props) => {
  const [volume, setVolume] = useState(0);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { filename } = usePlayAudioState();
  const { localStorageRef } = useAppState();

  useDidMount(() => {
    dispatch(ClientRenderedAction(localStorage));
    const recentVolume = localStorage.getItem("volume");
    setVolume(recentVolume != null ? parseInt(recentVolume) : 75);
  });

  return (
    <main
      onClick={() => {
        // iOSでの音声再生制限解除のための処理
        if (isFirstPlay && audioRef.current != null) {
          audioRef.current.play();
          audioRef.current.muted = false;
          setIsFirstPlay(false);
        }
      }}
    >
      {props.voiceList.map((section, index) => (
        <ButtonSectionContainer
          key={index + section.label}
          title={section.label}
          groups={section.audios}
        />
      ))}
      <audio
        id="player"
        ref={audioRef}
        onCanPlay={() => audioRef.current == null || audioRef.current.play()}
        onEnded={() => dispatch(StopAudioAction())}
        src={`static/audio/${filename}`}
        muted
        autoPlay
      />

      {localStorageRef != null ? (
        <AudioControllerContainer
          onChange={(_, newValue) => {
            if (audioRef.current && !Array.isArray(newValue))
              audioRef.current.volume = newValue / 100;
          }}
          onChangeCommited={(_, newValue) => {
            localStorageRef.setItem("volume", newValue.toString());
          }}
          defaultVolume={volume}
          target={audioRef.current || undefined}
        />
      ) : null}
    </main>
  );
};
