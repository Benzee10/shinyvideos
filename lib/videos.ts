
import { Video } from '../types';

import tutorialVideos from './data/tutorials';
import deepDiveVideos from './data/deep-dives';
import conceptVideos from './data/concepts';
import toolsAndTechVideos from './data/tools-and-tech';
import userUploadVideos from './data/user-uploads';
import sashaEVideos from './data/sasha-e';

const staticVideoData: Record<string, Omit<Video, 'category'>[]> = {
  'Tutorials': tutorialVideos,
  'Deep Dives': deepDiveVideos,
  'Concepts': conceptVideos,
  'Tools & Tech': toolsAndTechVideos,
  'Sasha E': sashaEVideos,
  'User Uploads': userUploadVideos,
};

const addCategoryToVideo = (video: Omit<Video, 'category'>, category: string): Video => ({
  ...video,
  category,
});

export function getAllVideos(): Video[] {
  const allVideos = Object.entries(staticVideoData).flatMap(([category, videos]) =>
    videos.map(video => addCategoryToVideo(video, category))
  );
  return allVideos;
}

export function getVideoBySlug(slug: string): Video | undefined {
  const allVideos = getAllVideos();
  return allVideos.find(v => v.slug === slug);
}

export function getVideosByCategory(): Record<string, Video[]> {
  const categories: Record<string, Video[]> = {};
  
  for (const category of Object.keys(staticVideoData)) {
    // Filter out empty categories
    if (staticVideoData[category] && staticVideoData[category].length > 0) {
      categories[category] = staticVideoData[category].map(video => addCategoryToVideo(video, category));
    }
  }

  return categories;
}
