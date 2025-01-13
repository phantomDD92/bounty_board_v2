import Video from '@/lib/models/Video';
import dbConnect from '@/lib/mongoose';

export const create = async ({ title, url }: { title: string, url: string }) => {
    await dbConnect();  // Ensure DB connection
    const video = await Video.create({title, url});

    return video;
};


const VideoService = {
  create,
}

export default VideoService;
