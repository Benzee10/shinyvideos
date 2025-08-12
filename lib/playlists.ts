
export interface Playlist {
  id: string;
  name: string;
  description: string;
  videoSlugs: string[];
  createdAt: string;
  updatedAt: string;
}

const PLAYLISTS_KEY = 'user_playlists';

export function getPlaylists(): Playlist[] {
  try {
    const stored = localStorage.getItem(PLAYLISTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading playlists:', error);
    return [];
  }
}

export function createPlaylist(name: string, description: string = ''): Playlist {
  const playlist: Playlist = {
    id: Date.now().toString(),
    name,
    description,
    videoSlugs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const playlists = getPlaylists();
  playlists.push(playlist);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  
  return playlist;
}

export function addVideoToPlaylist(playlistId: string, videoSlug: string): boolean {
  const playlists = getPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (playlist && !playlist.videoSlugs.includes(videoSlug)) {
    playlist.videoSlugs.push(videoSlug);
    playlist.updatedAt = new Date().toISOString();
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    return true;
  }
  
  return false;
}

export function removeVideoFromPlaylist(playlistId: string, videoSlug: string): boolean {
  const playlists = getPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (playlist) {
    const index = playlist.videoSlugs.indexOf(videoSlug);
    if (index > -1) {
      playlist.videoSlugs.splice(index, 1);
      playlist.updatedAt = new Date().toISOString();
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
      return true;
    }
  }
  
  return false;
}

export function deletePlaylist(playlistId: string): boolean {
  const playlists = getPlaylists();
  const index = playlists.findIndex(p => p.id === playlistId);
  
  if (index > -1) {
    playlists.splice(index, 1);
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    return true;
  }
  
  return false;
}
