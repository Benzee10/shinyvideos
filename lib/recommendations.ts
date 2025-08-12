
import { Video } from '../types';
import { getStoredProgress } from './progress';
import { getFavorites } from './favorites';

export interface RecommendationScore {
  video: Video;
  score: number;
  reasons: string[];
}

export function getRecommendations(allVideos: Video[], currentVideo?: Video, limit: number = 10): RecommendationScore[] {
  const progress = getStoredProgress();
  const favorites = getFavorites();
  const watchedSlugs = Object.keys(progress);
  const favoriteSlugs = favorites;

  const recommendations = allVideos
    .filter(video => video.slug !== currentVideo?.slug)
    .map(video => {
      let score = 0;
      const reasons: string[] = [];

      // Category similarity
      if (currentVideo && video.category === currentVideo.category) {
        score += 30;
        reasons.push('Same category');
      }

      // Tag similarity
      if (currentVideo) {
        const sharedTags = video.tags.filter(tag => currentVideo.tags.includes(tag));
        score += sharedTags.length * 10;
        if (sharedTags.length > 0) {
          reasons.push(`${sharedTags.length} shared tags`);
        }
      }

      // Similar to favorites
      const similarToFavorites = favoriteSlugs.some(favSlug => {
        const favVideo = allVideos.find(v => v.slug === favSlug);
        return favVideo && (
          favVideo.category === video.category ||
          favVideo.tags.some(tag => video.tags.includes(tag))
        );
      });
      if (similarToFavorites) {
        score += 20;
        reasons.push('Similar to favorites');
      }

      // Boost unwatch videos
      if (!watchedSlugs.includes(video.slug)) {
        score += 15;
        reasons.push('Unwatched');
      }

      // Duration preference based on watch history
      const avgWatchedDuration = watchedSlugs.length > 0 
        ? watchedSlugs.reduce((sum, slug) => {
            const vid = allVideos.find(v => v.slug === slug);
            return sum + (vid ? parseDuration(vid.duration) : 0);
          }, 0) / watchedSlugs.length
        : 300; // Default 5 minutes

      const videoDuration = parseDuration(video.duration);
      const durationDiff = Math.abs(videoDuration - avgWatchedDuration);
      if (durationDiff < 60) { // Within 1 minute
        score += 10;
        reasons.push('Preferred duration');
      }

      return { video, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations;
}

function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function getPersonalizedHomeFeed(allVideos: Video[], limit: number = 20): Video[] {
  const recommendations = getRecommendations(allVideos, undefined, limit);
  return recommendations.map(rec => rec.video);
}
