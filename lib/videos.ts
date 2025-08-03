
import { Video } from '../types';

import melissaStrattonVideos from './data/melissa-stratton';
import sashaEVideos from './data/sasha-e';
import nikoletaVideos from './data/nikoleta';

const staticVideoData: Record<string, Omit<Video, 'category'>[]> = {
  'Sasha E': sashaEVideos,
  'Melissa Stratton': melissaStrattonVideos,
  'Nikoleta': nikoletaVideos,
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
