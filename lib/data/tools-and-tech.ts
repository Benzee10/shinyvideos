import { Video } from '../../types';

export const videos: Omit<Video, 'category'>[] = [
    {
      slug: 'mastering-the-gemini-api',
      title: 'Mastering the Gemini API with React',
      uploadDate: '2024-05-30',
      thumbnail: 'https://picsum.photos/seed/gemini-api/1280/720',
      videoUrl: 'https://www.youtube.com/embed/G-z0p9mtwYQ',
      duration: '38:24',
      tags: ['AI', 'Gemini', 'API Integration'],
      description: `Unlock the potential of generative AI in your applications. This tutorial demonstrates how to integrate the Google Gemini API into a React project to build intelligent features.`
    },
    {
      slug: 'deploying-to-vercel-in-minutes',
      title: 'Deploying to Vercel in Minutes',
      uploadDate: '2024-05-18',
      thumbnail: 'https://picsum.photos/seed/vercel/1280/720',
      videoUrl: 'https://www.youtube.com/embed/f3a_1T4gG7U',
      duration: '12:08',
      tags: ['Deployment', 'Vercel', 'CI/CD'],
      description: `Go from local development to a live production URL in minutes. This guide walks you through the simple process of deploying a web application to Vercel via GitHub.`
    },
];
