import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';

type Props = {
  youtubeId?: string,
}

const YouTubePreview = ({ youtubeId }: Props) => {

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  return (
    <YouTube videoId={youtubeId} opts={opts} onReady={onPlayerReady} />
  )

}

export default YouTubePreview
