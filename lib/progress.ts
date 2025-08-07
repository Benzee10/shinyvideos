
// Video progress tracking
export interface VideoProgress {
  slug: string;
  currentTime: number;
  duration: number;
  timestamp: number;
}

const PROGRESS_KEY = 'video_progress';

export function saveProgress(slug: string, currentTime: number, duration: number): void {
  const progress: VideoProgress = {
    slug,
    currentTime,
    duration,
    timestamp: Date.now()
  };
  
  const allProgress = getStoredProgress();
  allProgress[slug] = progress;
  
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function getProgress(slug: string): VideoProgress | null {
  const allProgress = getStoredProgress();
  return allProgress[slug] || null;
}

export function getStoredProgress(): Record<string, VideoProgress> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function clearProgress(slug: string): void {
  const allProgress = getStoredProgress();
  delete allProgress[slug];
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}
