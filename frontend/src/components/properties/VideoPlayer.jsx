import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  
  if (!videoUrl) {
    return null;
  }
  
  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  return (
    <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-black">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-contain cursor-pointer"
        src={videoUrl}
        controls
        muted
        playsInline
        onClick={handlePlay}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
      
      {error && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center p-4">
            <p>Video could not be loaded</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string
};

export default VideoPlayer;

