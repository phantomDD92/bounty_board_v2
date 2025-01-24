import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';

import {
  TwitterVideoEmbed,
} from 'react-twitter-embed';

import './index.css';

type Props = {
  url?: string,
}

const VideoPreview = ({ url }: Props) => {

  const isYouTubeURL = (url: string | undefined) => {
    if (!url)
      return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.+)?$/;

    return youtubeRegex.test(url);
  }

  function getYouTubeVideoId(input: string) {
    // Regular expression to match YouTube URLs
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts|watch)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Regular expression to validate if the input is already a video ID
    const idRegex = /^[a-zA-Z0-9_-]{11}$/;

    if (idRegex.test(input)) {
      // Input is already a valid YouTube video ID
      return input;
    }

    const match = input.match(urlRegex);

    return match ? match[1] : ""; // Return video ID if found, otherwise null
  }


  function isTweetURL(url: string | undefined) {
    try {
      if (!url)
        return false;
      const parsedUrl = new URL(url);

      const isValidDomain =
        parsedUrl.hostname === "x.com" || parsedUrl.hostname === "twitter.com";

      const match = parsedUrl.pathname.match(/^\/[^/]+\/status\/(\d+)/);
      const tweetId = match ? match[1] : "";

      return isValidDomain && tweetId != "";
    } catch (e) {
      return false;
    }
  }

  function getTweetId(url: string) {
    try {
      const parsedUrl = new URL(url);
      const match = parsedUrl.pathname.match(/^\/[^/]+\/status\/(\d+)/);
      const tweetId = match ? match[1] : "";

      return tweetId;
    } catch (e) {
      return "";
    }
  }

  const opts: YouTubeProps['opts'] = {
    width: 400,
    height: 225,
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.stopVideo();
  }

  return (
    <div className='min-h-[250px]'>
      {isYouTubeURL(url) ?
        <YouTube videoId={getYouTubeVideoId(url || "")} opts={opts} onReady={onPlayerReady} />
        : isTweetURL(url)
          ? <TwitterVideoEmbed id={getTweetId(url || "")} />
          : url && url != "" ? <video width="400px" height="225px" controls>
            <source src={url || ""} type="video/ogg" />
          </video>
            : <div className='w-[400px] h-[225px] flex justify-center items-center'>
              <span>No Video</span></div>
      }
    </div>
  )

}

export default VideoPreview
