'use client';

import React, { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import Surahs from "./Surahs";

const PlayAudio = () => {
  const [singleData, setSingleData] = useState({});
  const [audioData, setAudioData] = useState({});
  const [surahList, setSurahList] = useState([]);
  const [src, setSrc] = useState(audioData?.audio_file?.audio_url);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/index.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setSurahList([...data]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.quran.com/api/v4/chapter_recitations/3/${
        singleData.id ? singleData.id : 1
      } `
    )
      .then((res) => res.json())
      .then((data) => {
        setAudioData({ ...data });
        setIsLoading(false);
      });
    setSrc(audioData?.audio_file?.audio_url);
  }, [singleData]);

  return (
    <div>
      <AudioPlayer
        
        className="bg-white dark:bg-gray-800 shadow-md rounded-md px-5 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 lg:px-6 lg:py-4"
        autoPlay
       
        src={src}
       
        showSkipControls={true}
        showJumpControls={false}
        header={
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
            Now playing:
            <p>
              {singleData.transliteration}{" "}
            </p>
          </p>
        }

        
      />

      <div>
        <Surahs
          setSingleData={setSingleData}
          singleData={singleData}
          surahList={surahList}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PlayAudio;
