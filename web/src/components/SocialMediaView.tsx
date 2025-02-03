import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  XEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed';

import { VideoType } from '@/types/enumTypes';

type Props = {
  url?: string,
}

const SocialMediaView = ({ url }: Props) => {

  const getVideoType = (url?: string) => {
    if (!url)
      return VideoType.NONE;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.+)?$/;

    if (youtubeRegex.test(url))
      return VideoType.YOUTUBE;
    const tweetRegex = /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)(\/.+)?$/;

    if (tweetRegex.test(url))
      return VideoType.TWEET;
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com)(\/.+)?$/;

    if (tiktokRegex.test(url))
      return VideoType.TIKTOK;
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com(\/.+)?$/;

    if (facebookRegex.test(url))
      return VideoType.FACEBOOK
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com(\/.+)?$/;

    if (instagramRegex.test(url))
      return VideoType.INSTAGRAM
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com(\/.+)?$/;

    if (linkedinRegex.test(url))
      return VideoType.LINKEDIN
    const pinterestRegex = /^(https?:\/\/)?(www\.)?pinterest\.com(\/.+)?$/

    if (pinterestRegex.test(url))
      return VideoType.PINTEREST

    return VideoType.UNKNOWN;
  }

  const getVideoEmbedComponent = (url?: string) => {
    if (!url)
      return (
        <div className='w-[400px] h-[225px] flex justify-center items-center'>
          <span>No Video</span>
        </div>
      );

    switch (getVideoType(url)) {
      case VideoType.FACEBOOK:
        return <FacebookEmbed url={url} />
      case VideoType.YOUTUBE:
        return <YouTubeEmbed url={url} />;
      case VideoType.TWEET:
        return <XEmbed url={url} />;
      case VideoType.TIKTOK:
        return <TikTokEmbed url={url} />
      case VideoType.INSTAGRAM:
        return <InstagramEmbed url={url} />;
      case VideoType.LINKEDIN:
        return <LinkedInEmbed url={url} />
      case VideoType.PINTEREST:
        <PinterestEmbed url={url} />
      default:
        break;
    }

    return (
      <div className='w-[400px] h-[225px] flex justify-center items-center'>
        <span>Unknown Video</span>
      </div>
    );
  }

  return (
    <div className='min-h-[250px]'>
      {getVideoEmbedComponent(url)}
    </div>
  )

}

export default SocialMediaView
