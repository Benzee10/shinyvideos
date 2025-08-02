
import React, { useState } from 'react';
import { Video } from '../types';
import { CopyIcon } from '../components/Icons';

// Helper to create a URL-friendly slug from a string
const createSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/&/g, 'and') // replace & with 'and'
    .replace(/[^\w\s-]/g, '') // remove all non-word, non-space, non-hyphen chars
    .replace(/[\s_-]+/g, '-') // replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
};

const AddVideoPage: React.FC = () => {
    const [videoDetails, setVideoDetails] = useState({
        title: '',
        videoUrl: '',
        thumbnail: '',
        duration: '',
        tags: '', // Will be handled as a comma-separated string
        description: '',
    });
    const [slug, setSlug] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVideoDetails(prev => ({ ...prev, [name]: value }));

        if (name === 'title') {
            setSlug(createSlug(value));
        }
    };
    
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    }

    const handleCopyToClipboard = () => {
        if (generatedVideo) {
            navigator.clipboard.writeText(generatedVideo).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            }, (err) => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    const handleGenerateCode = (e: React.FormEvent) => {
        e.preventDefault();

        const newVideoObject: Omit<Video, 'category'> = {
            slug: slug || createSlug(videoDetails.title),
            title: videoDetails.title,
            uploadDate: new Date().toISOString().split('T')[0],
            thumbnail: videoDetails.thumbnail,
            videoUrl: videoDetails.videoUrl,
            duration: videoDetails.duration,
            tags: videoDetails.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            description: videoDetails.description,
        };

        setGeneratedVideo(JSON.stringify(newVideoObject, null, 4)); // Using 4 spaces for indentation
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">Video Data Generator</h1>
                <p className="text-gray-400 mb-8 text-center">
                    Fill in the details below to generate the video object for your app.
                </p>

                <form onSubmit={handleGenerateCode} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={videoDetails.title}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">Slug (URL-friendly identifier)</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={handleSlugChange}
                            required
                            placeholder="auto-generated-from-title"
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                         <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but can be overridden.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-2">Video URL (.mp4 or Embed)</label>
                           <input
                               type="url"
                               id="videoUrl"
                               name="videoUrl"
                               value={videoDetails.videoUrl}
                               onChange={handleInputChange}
                               required
                               placeholder="https://.../video.mp4 or https://.../embed/..."
                               className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                           />
                        </div>
                        <div>
                           <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Image URL</label>
                           <input
                               type="url"
                               id="thumbnail"
                               name="thumbnail"
                               value={videoDetails.thumbnail}
                               onChange={handleInputChange}
                               required
                               placeholder="https://example.com/image.jpg"
                               className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                           />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">Duration (e.g., 23:45)</label>
                           <input
                               type="text"
                               id="duration"
                               name="duration"
                               value={videoDetails.duration}
                               onChange={handleInputChange}
                               required
                               placeholder="MM:SS"
                               className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                           />
                        </div>
                        <div>
                           <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                           <input
                               type="text"
                               id="tags"
                               name="tags"
                               value={videoDetails.tags}
                               onChange={handleInputChange}
                               required
                               placeholder="Tag1, Tag2, Tag3"
                               className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                           />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={videoDetails.description}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div className="text-center pt-2">
                        <button
                           type="submit"
                           className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                        >
                           Generate Code
                        </button>
                    </div>
                </form>

                {generatedVideo && (
                    <div className="mt-10 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-2">Success! Video Data Generated.</h2>
                        <p className="text-gray-400 mb-4">Copy the code below and paste it inside the array `[]` in the desired data file (e.g., <code className="text-cyan-400 bg-gray-800 px-1 py-0.5 rounded">lib/data/user-uploads.ts</code>). Make sure to add a comma if it's not the last item in the array.</p>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={generatedVideo}
                                className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-gray-300 rounded-md border border-gray-600 resize-none focus:outline-none"
                                aria-label="Generated video data"
                            />
                            <button 
                                onClick={handleCopyToClipboard}
                                className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-all"
                                aria-label="Copy to clipboard"
                            >
                                <CopyIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {copySuccess && (
                           <div className="mt-3 text-center text-lime-400 font-semibold">
                                Copied to clipboard!
                           </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddVideoPage;
