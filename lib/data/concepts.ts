import { Video } from '../../types';

export const videos: Omit<Video, 'category'>[] = [
   {
    slug: 'ux-design-principles-for-developers',
    title: 'UX Design Principles for Developers',
    uploadDate: '2024-06-12',
    thumbnail: 'https://picsum.photos/seed/ux-design/1280/720',
    videoUrl: 'https://www.youtube.com/embed/vB1zT4yBDuA',
    duration: '21:57',
    tags: ['UI/UX', 'Design', 'Development'],
    description: `You don't need to be a designer to create great user experiences. This video teaches developers the core principles of UX design to make your applications more intuitive and user-friendly.`
  },
];
