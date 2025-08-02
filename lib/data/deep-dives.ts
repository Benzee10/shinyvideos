import { Video } from '../../types';

export const videos: Omit<Video, 'category'>[] = [
  {
    slug: 'building-a-rest-api-with-nodejs',
    title: 'Building a REST API with Node.js & Express',
    uploadDate: '2024-07-10',
    thumbnail: 'https://picsum.photos/seed/nodejs-api/1280/720',
    videoUrl: 'https://www.youtube.com/embed/SccSCuHhOw0',
    duration: '45:30',
    tags: ['Node.js', 'API', 'Backend'],
    description: `A complete guide to building a robust REST API using Node.js and the Express framework. We will set up routes, controllers, and middleware for a real-world application.`
  },
  {
    slug: 'nextjs-14-app-router-deep-dive',
    title: 'Next.js 14 App Router Deep Dive',
    uploadDate: '2024-06-20',
    thumbnail: 'https://picsum.photos/seed/nextjs14/1280/720',
    videoUrl: 'https://www.youtube.com/embed/m5_n0t_N2iY',
    duration: '55:19',
    tags: ['Next.js', 'React', 'Full-stack'],
    description: `Explore the power of the Next.js App Router. We'll cover server components, client components, layouts, and data fetching strategies in Next.js 14.`
  },
];
