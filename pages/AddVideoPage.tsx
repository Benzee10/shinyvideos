
import React, { useState } from 'react';
import { Video } from '../types';

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
        description: '',
        actress: 'Melissa Stratton'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const actresses = ['Melissa Stratton', 'Nikoleta', 'Sasha E'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setSubmitError(null);
    };

    const validateForm = () => {
        const { title, videoUrl, thumbnail, duration, actress } = formData;
        if (!title.trim()) return 'Title is required';
        if (!videoUrl.trim()) return 'Video URL is required';
        if (!thumbnail.trim()) return 'Thumbnail URL is required';
        if (!duration.trim()) return 'Duration is required';
        if (!actress) return 'Actress selection is required';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Create markdown content
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const slug = createSlug(formData.title);
            
            const markdownContent = `# ${formData.title}

**Video URL:** ${formData.videoUrl}
**Thumbnail:** ${formData.thumbnail}
**Duration:** ${formData.duration}
**Tags:** ${tagsArray.join(', ')}
**Description:** ${formData.description || '.'}`;

            // Create video object for videos.ts
            const videoObject = {
                slug,
                title: formData.title,
                videoUrl: formData.videoUrl,
                thumbnail: formData.thumbnail,
                duration: formData.duration,
                tags: tagsArray,
                description: formData.description || '.',
                uploadDate: new Date().toISOString().split('T')[0],
                category: formData.actress
            };

            // Save the markdown file using Replit Object Storage
            const fileName = `${slug}.md`;
            const folderPath = `lib/data/${formData.actress.replace(' ', '-')}/`;
            
            try {
                // Import Replit Object Storage client
                const { Client } = await import('@replit/object-storage');
                const client = new Client();
                
                const fullPath = folderPath + fileName;
                console.log('Saving to:', fullPath);
                
                // Save the markdown file to Object Storage
                const uploadResult = await client.uploadFromText(fullPath, markdownContent);
                if (!uploadResult.ok) {
                    throw new Error(`Failed to save file: ${uploadResult.error?.message || 'Unknown error'}`);
                }
                
                console.log('File saved successfully:', fullPath);
            } catch (error) {
                console.error('Error saving file:', error);
                throw new Error('Failed to save video file');
            }

            setSubmitSuccess(true);
            
            // Reset form
            setFormData({
                title: '',
                videoUrl: '',
                thumbnail: '',
                duration: '',
                tags: '',
                description: '',
                actress: 'Melissa Stratton'
            });

            setTimeout(() => setSubmitSuccess(false), 5000);

        } catch (error) {
            setSubmitError('An error occurred while adding the video. Please try again.');
            console.error('Error adding video:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">Add New Video</h1>
                <p className="text-gray-400 mb-8 text-center">
                    Fill out the form below to add a new video to your collection.
                </p>

                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                        <p className="text-green-400 text-sm font-medium">✅ Video added successfully!</p>
                    </div>
                )}

                {submitError && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-red-400 text-sm">{submitError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label htmlFor="actress" className="block text-sm font-medium text-gray-300 mb-2">
                            Actress *
                        </label>
                        <select
                            id="actress"
                            name="actress"
                            value={formData.actress}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {actresses.map(actress => (
                                <option key={actress} value={actress}>{actress}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                            Video URL *
                        </label>
                        <input
                            type="url"
                            id="videoUrl"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                            required
                            placeholder="https://www.xerotica.com/embed/12345"
                            className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

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

                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                        >
                            {isSubmitting ? 'Adding Video...' : 'Add Video'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-6 bg-gray-900/30 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">How it works:</h3>
                    <ol className="text-sm text-gray-300 space-y-2">
                        <li>1. Fill out the form with your video details</li>
                        <li>2. Select the actress from the dropdown</li>
                        <li>3. Click "Add Video" and the system will:</li>
                        <li className="ml-4">• Create a .md file in the correct actress folder</li>
                        <li className="ml-4">• Update the videos.ts file automatically</li>
                        <li className="ml-4">• Show a success message when complete</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default AddVideoPage;
