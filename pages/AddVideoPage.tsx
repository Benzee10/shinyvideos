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

// Helper to parse markdown format into video object
const parseMarkdownToVideo = (markdown: string): Omit<Video, 'category'> | null => {
  try {
    const lines = markdown.split('\n').map(line => line.trim()).filter(line => line);
    const videoData: any = {};

    for (const line of lines) {
      if (line.startsWith('# ')) {
        videoData.title = line.replace('# ', '');
        videoData.slug = createSlug(videoData.title);
      } else if (line.startsWith('**Video URL:**')) {
        videoData.videoUrl = line.replace('**Video URL:**', '').trim();
      } else if (line.startsWith('**Thumbnail:**')) {
        videoData.thumbnail = line.replace('**Thumbnail:**', '').trim();
      } else if (line.startsWith('**Duration:**')) {
        videoData.duration = line.replace('**Duration:**', '').trim();
      } else if (line.startsWith('**Tags:**')) {
        const tagsStr = line.replace('**Tags:**', '').trim();
        videoData.tags = tagsStr.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (line.startsWith('**Description:**')) {
        videoData.description = line.replace('**Description:**', '').trim();
      } else if (!line.startsWith('**') && !line.startsWith('#') && videoData.description === undefined) {
        // This handles multi-line descriptions correctly if the Description line is present.
        // If Description line is missing, this will be the first content.
        videoData.description = line;
      } else if (videoData.description !== undefined && !line.startsWith('**') && !line.startsWith('#')) {
          videoData.description += '\n' + line;
      }
    }

    // Set upload date to today
    videoData.uploadDate = new Date().toISOString().split('T')[0];

    // Validate required fields
    if (!videoData.title || !videoData.videoUrl || !videoData.thumbnail || !videoData.duration) {
      return null;
    }

    return videoData;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return null;
  }
};

const AddVideoPage: React.FC = () => {
    const [markdownInput, setMarkdownInput] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownInput(e.target.value);
        setParseError(null);
    };

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
        setParseError(null);

        const parsedVideo = parseMarkdownToVideo(markdownInput);

        if (!parsedVideo) {
            setParseError('Invalid markdown format. Please check the example format below.');
            return;
        }

        setGeneratedVideo(JSON.stringify(parsedVideo, null, 4));
    };

    const exampleMarkdown = `# Your Video Title Here

**Video URL:** https://www.example.com/embed/12345
**Thumbnail:** https://i.postimg.cc/example/thumbnail.jpg
**Duration:** 05:30
**Tags:** Tag1, Tag2, Tag3
**Description:** Your video description goes here.`;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">Video Data Generator</h1>
                <p className="text-gray-400 mb-8 text-center">
                    Enter video details in markdown format to generate the video object for your app.
                </p>

                <form onSubmit={handleGenerateCode} className="space-y-6">
                    <div>
                        <label htmlFor="markdown" className="block text-sm font-medium text-gray-300 mb-2">
                            Video Details (Markdown Format)
                        </label>
                        <textarea
                            id="markdown"
                            name="markdown"
                            rows={12}
                            value={markdownInput}
                            onChange={handleInputChange}
                            required
                            placeholder={exampleMarkdown}
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Follow the exact format shown in the placeholder. All fields are required except description can be multi-line.
                        </p>
                    </div>

                    {parseError && (
                        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                            <p className="text-red-400 text-sm">{parseError}</p>
                        </div>
                    )}

                    <div className="text-center pt-2">
                        <button
                           type="submit"
                           className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                        >
                           Generate Code
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-6 bg-gray-900/30 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Markdown Format Example:</h3>
                    <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded-md overflow-x-auto">
{exampleMarkdown}
                    </pre>
                    <p className="text-xs text-gray-500 mt-2">
                        Copy this format and replace with your video details. The slug will be auto-generated from the title.
                    </p>
                </div>

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