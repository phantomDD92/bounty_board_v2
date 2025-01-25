import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  XEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed';

type Props = {
  url?: string,
}

const VideoPreview = ({ url }: Props) => {

  const isYouTubeURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.+)?$/;

    return regex.test(url);
  }

  const isTweetURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)(\/.+)?$/;

    return regex.test(url);
  }

  const isTikTokURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+)?$/;

    return regex.test(url);
  }

  const isFacebookURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+)?$/;

    return regex.test(url);
  }

  const isInstagramURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+)?$/;

    return regex.test(url);
  }

  const isLinkedInURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+)?$/;

    return regex.test(url);
  }

  const isPinterestURL = (url: string | undefined) => {
    if (!url)
      return false;
    const regex = /^(https?:\/\/)?(www\.)?(pinterest\.com)(\/.+)?$/;

    return regex.test(url);
  }

  return (
    <div className='min-h-[250px]'>
      {!url
        ? <div className='w-[400px] h-[225px] flex justify-center items-center'>
          <span>No Video</span>
        </div>
        : isYouTubeURL(url)
          ? <YouTubeEmbed url={url} />
          : isTweetURL(url)
            ? <XEmbed url={url} />
            : isTikTokURL(url)
              ? <TikTokEmbed url={url} />
              : isFacebookURL(url)
                ? <FacebookEmbed url={url} />
                : isInstagramURL(url)
                  ? <InstagramEmbed url={url} />
                  : isLinkedInURL(url)
                    ? <LinkedInEmbed url={url} />
                    : isPinterestURL(url)
                      ? <PinterestEmbed url={url} />
                      : <div className='w-[400px] h-[225px] flex justify-center items-center'>
                        <span>No Video</span>
                      </div>
      }
    </div>
  )

}

export default VideoPreview
