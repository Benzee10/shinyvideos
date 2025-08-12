
export interface Comment {
  id: string;
  videoSlug: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

const COMMENTS_KEY = 'video_comments';
const USERNAME_KEY = 'user_name';

export function getComments(videoSlug: string): Comment[] {
  try {
    const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
    return allComments[videoSlug] || [];
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
}

export function addComment(videoSlug: string, content: string, parentId?: string): Comment {
  const username = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
  const comment: Comment = {
    id: Date.now().toString(),
    videoSlug,
    username,
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: []
  };

  const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
  if (!allComments[videoSlug]) {
    allComments[videoSlug] = [];
  }

  if (parentId) {
    const parent = findComment(allComments[videoSlug], parentId);
    if (parent) {
      parent.replies.push(comment);
    }
  } else {
    allComments[videoSlug].push(comment);
  }

  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  return comment;
}

function findComment(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    const found = findComment(comment.replies, id);
    if (found) return found;
  }
  return null;
}

export function setUsername(name: string): void {
  localStorage.setItem(USERNAME_KEY, name);
}

export function getUsername(): string {
  return localStorage.getItem(USERNAME_KEY) || 'Anonymous';
}
