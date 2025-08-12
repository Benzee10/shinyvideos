import { getAllVideos } from './videos';
import { Video } from '../types';

// Simulate a database (like a JSON file on a server) for view counts.
// Using a Record to type this as a dictionary/hash map.
const _viewCounts: Record<string, number> = {};

// Initialize with some random baseline views to make it look realistic.
// This function creates a pseudo-random but deterministic starting view count based on the video slug.
const initializeViewCounts = (videos: Video[]): void => {
  videos.forEach(video => {
    const hash = video.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Formula to generate high, varied, and deterministic view counts (10K to 500K+ range)
    const baseViews = (hash % 50000) * (video.tags.length + 1) + (hash % 25000) + 10000;
    const multiplier = (hash % 3) + 2; // Random multiplier between 2-4
    _viewCounts[video.slug] = Math.floor(baseViews * multiplier);
  });
};

// Immediately initialize the counts when the module is loaded.
initializeViewCounts(getAllVideos());

/**
 * Increments the view count for a specific video slug.
 * This simulates a user watching a video.
 * @param slug - The unique identifier for the video.
 */
export function trackView(slug: string): void {
  if (typeof _viewCounts[slug] === 'number') {
    _viewCounts[slug]++;
  } else {
    // If for some reason a video is not in the initial list, start it at 1.
    _viewCounts[slug] = 1;
  }
}

/**
 * Retrieves the current view count for a specific video slug.
 * @param slug - The unique identifier for the video.
 * @returns The number of views.
 */
export function getViews(slug: string): number {
  return _viewCounts[slug] || 0;
}
