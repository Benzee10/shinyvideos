import { Video } from '../types';

import { videos as tutorialVideos } from './data/tutorials';
import { videos as deepDiveVideos } from './data/deep-dives';
import { videos as conceptVideos } from './data/concepts';
import { videos as toolsAndTechVideos } from './data/tools-and-tech';

const videoData: Record<string, Omit<Video, 'category'>[]> = {
  'Tutorials': tutorialVideos,
  'Deep Dives': deepDiveVideos,
  'Concepts': conceptVideos,
  'Tools & Tech': toolsAndTechVideos,
};

// This helper function re-attaches the category to the video object.
const addCategoryToVideo = (video: Omit<Video, 'category'>, category: string): Video => {
  return {
    ...video,
    category,
  };
};

export function getAllVideos(): Video[] {
  return Object.entries(videoData).flatMap(([category, videos]) =>
    videos.map(video => addCategoryToVideo(video, category))
  );
}

export function getVideoBySlug(slug: string): Video | undefined {
  for (const category of Object.keys(videoData)) {
    const video = videoData[category].find(v => v.slug === slug);
    if (video) {
      return addCategoryToVideo(video, category);
    }
  }
  return undefined;
}

export function getVideosByCategory(): Record<string, Video[]> {
  const categories: Record<string, Video[]> = {};
  for (const category of Object.keys(videoData)) {
    categories[category] = videoData[category].map(video => addCategoryToVideo(video, category));
  }
  return categories;
}
