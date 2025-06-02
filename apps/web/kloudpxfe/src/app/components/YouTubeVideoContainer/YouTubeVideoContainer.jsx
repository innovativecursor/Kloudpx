"use client";
import React from "react";
import YouTube from "react-youtube";

const YouTubeVideoContainer = ({ videoId }) => {
  return (
    <>
      <div className="video-container">
        <YouTube videoId={videoId} />
      </div>
    </>
  );
};

export default YouTubeVideoContainer;
