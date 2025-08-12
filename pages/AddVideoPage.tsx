import React, { useState } from 'react';

// Helper to create a URL-friendly slug from a string
const createSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const AddVideoPage: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        videoUrl: '',
        thumbnail: '',
        duration: '',
        tags: '',
        description: ''
    });
    const [generatedMarkdown, setGeneratedMarkdown] = useState('');
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { title, videoUrl, thumbnail, duration } = formData;
        if (!title.trim()) return 'Title is required';
        if (!videoUrl.trim()) return 'Video URL is required';
        if (!thumbnail.trim()) return 'Thumbnail URL is required';
        if (!duration.trim()) return 'Duration is required';
        return null;
    };

    const generateMarkdown = (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        const slug = createSlug(formData.title);

        const markdownContent = `# ${formData.title}

**Video URL:** ${formData.videoUrl}
**Thumbnail:** ${formData.thumbnail}
**Duration:** ${formData.duration}
**Tags:** ${tagsArray.join(', ')}
**Description:** ${formData.description || '.'}`;

        setGeneratedMarkdown(markdownContent);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedMarkdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearForm = () => {
        setFormData({
            title: '',
            videoUrl: '',
            thumbnail: '',
            duration: '',
            tags: '',
            description: ''
        });
        setGeneratedMarkdown('');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">Add New Video</h1>
                    <p className="text-gray-400 mb-8 text-center">
                        Fill out the form below to generate markdown code for your video.
                    </p>

                    <form onSubmit={generateMarkdown} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter video title"
                                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                                Video URL * (Embed URL or MP4 file URL)
                            </label>
                            <input
                                type="url"
                                id="videoUrl"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                                required
                                placeholder="https://www.xerotica.com/embed/12345 or https://example.com/video.mp4"
                                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Supports both embed URLs and direct MP4 links</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">
                                    Thumbnail URL *
                                </label>
                                <input
                                    type="url"
                                    id="thumbnail"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="https://i.postimg.cc/example/thumbnail.jpg"
                                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                                    Duration *
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="05:30"
                                    pattern="[0-9]{1,2}:[0-9]{2}"
                                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: MM:SS or HH:MM:SS</p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Brunette, Big Boobs, Masturbation"
                                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter video description (optional)"
                                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <div className="flex gap-4 justify-center pt-4">
                            <button
                                type="submit"
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                            >
                                Generate Markdown
                            </button>
                            <button
                                type="button"
                                onClick={clearForm}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

                {generatedMarkdown && (
                    <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Generated Markdown</h2>
                            <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    copied 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                }`}
                            >
                                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>

                        <pre className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 text-gray-300 overflow-x-auto text-sm whitespace-pre-wrap">
                            {generatedMarkdown}
                        </pre>

                        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-2">📝 Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                <li>1. Copy the generated markdown above</li>
                                <li>2. Create a new .md file in any folder under lib/data/ (supports nested subdirectories)</li>
                                <li>3. Use the slug as the filename: <code className="bg-gray-800 px-1 rounded">{createSlug(formData.title) || 'video-slug'}.md</code></li>
                                <li>4. Paste the markdown content and save</li>
                                <li>5. The video will automatically appear on the homepage!</li>
                            </ol>
                            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                <p className="text-blue-300 text-sm">
                                    <strong>Example paths:</strong><br/>
                                    • <code>lib/data/xerotica/Mila Azul/video-name.md</code><br/>
                                    • <code>lib/data/studio/performer/scene/video-name.md</code><br/>
                                    • <code>lib/data/category/subcategory/video-name.md</code>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddVideoPage;