import { Video } from '../../types';

export const videos: Omit<Video, 'category'>[] = [
   {
    slug: 'building-a-rest-api-with-nodejs',
    title: 'Building a REST API with Node.js & Express',
    uploadDate: '2025-08-02',
    thumbnail: 'https://cdn-media.xerotica.com/thumbs/6/6/b/b/3/7306a9d061347ea70c2273171edc80a6.mp4/1280/7306a9d061347ea70c2273171edc80a6.mp4_2_1280.jpg',
    videoUrl: 'https://www.xerotica.com/embed/55735',
    duration: '06:00',
    tags: ['Node.js', 'API', 'Backend'],
    description: `A complete guide to building a robust REST API using Node.js and the Express framework. We will set up routes, controllers, and middleware for a real-world application.`
  },
];
