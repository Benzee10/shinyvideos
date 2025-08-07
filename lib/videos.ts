

import { Video } from '../types';
import { Client } from '@replit/object-storage';

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
      } else if (line.startsWith('**Category:**')) {
        videoData.category = line.replace('**Category:**', '').trim();
      } else if (line.startsWith('**Description:**')) {
        videoData.description = line.replace('**Description:**', '').trim();
      } else if (!line.startsWith('**') && !line.startsWith('#') && videoData.description === undefined) {
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

// Import individual markdown files
const melissaStrattonCulinaryMd = `# Horny housewife showcases her culinary prowess as she simultaneously displays her sexual allure by flaunting her

**Video URL:** https://www.xerotica.com/embed/55571
**Thumbnail:** https://i.postimg.cc/zBk2YrQw/cd7a2e2a9d1c66b57dd27e464aed04fe-mp4-6-1280.jpg
**Duration:** 05:58
**Tags:** Melissa Stratton, Tattoo, Big Boobs, Playboy Plus
**Description:** .`;

const melissaStrattonBathtubMd = `# Gorgeous blonde sex symbol Melissa Stratton is absolutely smokin' hot as she sashays around her bathtub, flaunting her insanely alluring lithe figure while showing those massive, mouth-watering, real-deal melons.

**Video URL:** https://www.xerotica.com/embed/55735
**Thumbnail:** https://i.postimg.cc/cHLKcpVk/7306a9d061347ea70c2273171edc80a6-mp4-2-1280.jpg
**Duration:** 06:00
**Tags:** Melissa Stratton, Big Boobs, Wet, Brunette, Playboy Plus
**Description:** .`;

const melissaStrattonSwimsuitMd = `# Smoking-hot babe lays bare her seductive fake knockers while suggestively stripping down her swimsuit and assuming sultry stances near the swimming area.

**Video URL:** https://www.xerotica.com/embed/55395
**Thumbnail:** https://i.postimg.cc/y8fXCTsG/c015c45c10a2af27d598ceef85ab5b2f-mp4-7-1280.jpg
**Duration:** 05:53
**Tags:** Melissa Stratton, Playboy Plus, High Heels, Bikini
**Description:** .`;

const nikoletaBlondeStripsMd = `# Blonde babe Nikoletta is lookin' fine as she strips down, showin' off her hot bod. Slowly, she moves south to her privates and gets to work, rubbin' her juicy bud with intense vigor.

**Video URL:** https://www.xerotica.com/embed/55753
**Thumbnail:** https://i.postimg.cc/CMBqRgYm/8ddd7dd5a57d2679f49d75d07e54329c-mp4-4-1280.jpg
**Duration:** 02:57
**Tags:** Nikoleta, Masturbation, Blonde, Femjoy
**Description:** .`;

const nikoletaLesbianCouchMd = `# The hot-as-hell chicks get down together on the couch exposing their lovely bodies and having sensual lesbian sex

**Video URL:** https://www.xerotica.com/embed/55985
**Thumbnail:** https://i.postimg.cc/RF9M1yD6/359a46cab7ff42950d4375ea0f39c065-mp4-6-1280.jpg
**Duration:** 04:00
**Tags:** Nikoleta, Mirka, Lesbian, Club Sweethearts, Brunette, Big Boobs
**Description:** .`;

const nikoletaSqueakyCleanMd = `# Beautiful hottie Nikoletta poses nude in Squeaky Clean

**Video URL:** https://www.xerotica.com/embed/54567
**Thumbnail:** https://i.postimg.cc/brt3zVqg/85977f3588852f775ecfd7eaec269dea-mp4-4-1280.jpg
**Duration:** 05:57
**Tags:** Nikoleta, Wet, Blonde, Masturbation, Nubiles
**Description:** .`;

const nikoletaClemenceAudiardMd = `# Nikoleta's blonde curls frame her face as her wet slit glistens from Clemence Audiard's intense fuck, her girlfriend's strap-on sliding deep into that juicy hole.

**Video URL:** https://www.xerotica.com/embed/58446
**Thumbnail:** https://i.postimg.cc/26B4vqg8/ea00285ad535449016c08a43870d74b6-mp4-4-1280.jpg
**Duration:** 03:59
**Tags:** Nikoleta, Clemence Audiard, Straplez
**Description:** .`;

const nikoletaCatalinaMonteMd = `# Magnetic blonde Nikoleta bangs her dazzling girlfriend Catalina Monte with a strap-on, humping like a wild animal.

**Video URL:** https://www.xerotica.com/embed/58186
**Thumbnail:** https://i.postimg.cc/gJvxm3fR/504eff86267991eeb6fadf65f3c9df15-mp4-5-1280.jpg
**Duration:** 03:58
**Tags:** Nikoleta, Catalina Monte, Black Hair, Straplez, Lesbian, Blonde
**Description:** .`;

const sashaEMd = `# Alluring well-endowed babe strips on the floor exposing her alluring slender figure with massive natural boobs and masturbates

**Video URL:** https://www.xerotica.com/embed/54930
**Thumbnail:** https://i.postimg.cc/x1tbV43c/341bd6e23da75fcc2275ea802a920007-mp4-8-1280.jpg
**Duration:** 04:06
**Tags:** Sasha E, Brunette, Masturbation, Big Boobs, The Life Erotic
**Description:** The Life Erotic`;

// Static video data with categories
const staticVideoData: Array<{ markdownContent: string; category: string }> = [
  { markdownContent: melissaStrattonCulinaryMd, category: 'Melissa Stratton' },
  { markdownContent: melissaStrattonBathtubMd, category: 'Melissa Stratton' },
  { markdownContent: melissaStrattonSwimsuitMd, category: 'Melissa Stratton' },
  { markdownContent: nikoletaBlondeStripsMd, category: 'Nikoleta' },
  { markdownContent: nikoletaLesbianCouchMd, category: 'Nikoleta' },
  { markdownContent: nikoletaSqueakyCleanMd, category: 'Nikoleta' },
  { markdownContent: nikoletaClemenceAudiardMd, category: 'Nikoleta' },
  { markdownContent: nikoletaCatalinaMonteMd, category: 'Nikoleta' },
  { markdownContent: sashaEMd, category: 'Sasha E' },
];

const addCategoryToVideo = (video: Omit<Video, 'category'>, category: string): Video => ({
  ...video,
  category,
});

// Function to load videos from markdown files
async function loadVideosFromFiles(): Promise<Video[]> {
  const allVideos: Video[] = [];
  
  // Define categories and their corresponding folder structures
  const categories = [
    'Melissa Stratton',
    'Nikoleta', 
    'Sasha E'
  ];

  // Function to convert category name to folder name
  const getFolderName = (category: string) => category.replace(' ', '-');

  for (const category of categories) {
    const folderName = getFolderName(category);
    
    try {
      // Import all markdown files from each category folder
      const moduleFiles = import.meta.glob('/lib/data/*/**.md', { 
        as: 'raw',
        eager: false 
      });

      for (const [path, moduleLoader] of Object.entries(moduleFiles)) {
        if (path.includes(`/lib/data/${folderName}/`)) {
          try {
            const content = await moduleLoader();
            const video = parseMarkdownToVideo(content);
            
            if (video) {
              // Use category from markdown or fallback to folder-based category
              const finalCategory = video.category || category;
              allVideos.push(addCategoryToVideo(video, finalCategory));
            }
          } catch (fileError) {
            console.warn(`Could not load video file ${path}:`, fileError);
          }
        }
      }
    } catch (error) {
      console.warn(`Error loading videos from ${category}:`, error);
    }
  }

  // Also try to load any additional category folders dynamically
  try {
    const allModuleFiles = import.meta.glob('/lib/data/*/**.md', { 
      as: 'raw',
      eager: false 
    });

    for (const [path, moduleLoader] of Object.entries(allModuleFiles)) {
      const pathParts = path.split('/');
      if (pathParts.length >= 4) {
        const folderName = pathParts[3]; // e.g., 'New-Category'
        const categoryName = folderName.replace('-', ' ');
        
        // Skip if we already processed this category
        if (categories.includes(categoryName)) continue;
        
        try {
          const content = await moduleLoader();
          const video = parseMarkdownToVideo(content);
          
          if (video) {
            const finalCategory = video.category || categoryName;
            allVideos.push(addCategoryToVideo(video, finalCategory));
          }
        } catch (fileError) {
          console.warn(`Could not load video file ${path}:`, fileError);
        }
      }
    }
  } catch (error) {
    console.warn('Error loading additional video categories:', error);
  }

  return allVideos;
}

export function getAllVideos(): Video[] {
  const staticVideos = staticVideoData.map(({ markdownContent, category }) => {
    const video = parseMarkdownToVideo(markdownContent);
    return video ? addCategoryToVideo(video, category) : null;
  }).filter(Boolean) as Video[];
  
  return staticVideos;
}

export async function getAllVideosWithDynamic(): Promise<Video[]> {
  const staticVideos = getAllVideos();
  const fileVideos = await loadVideosFromFiles();
  
  // Combine and deduplicate videos (file videos override static ones with same slug)
  const allVideos = [...staticVideos];
  const staticSlugs = new Set(staticVideos.map(v => v.slug));
  
  for (const fileVideo of fileVideos) {
    if (!staticSlugs.has(fileVideo.slug)) {
      allVideos.push(fileVideo);
    }
  }
  
  return allVideos;
}

export function getVideoBySlug(slug: string): Video | undefined {
  const allVideos = getAllVideos();
  return allVideos.find(v => v.slug === slug);
}

export function getVideosByCategory(): Record<string, Video[]> {
  const categories: Record<string, Video[]> = {};
  
  for (const { markdownContent, category } of staticVideoData) {
    const video = parseMarkdownToVideo(markdownContent);
    if (video) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(addCategoryToVideo(video, category));
    }
  }

  return categories;
}

export async function getVideosByCategoryWithDynamic(): Promise<Record<string, Video[]>> {
  const allVideos = await getAllVideosWithDynamic();
  const categories: Record<string, Video[]> = {};
  
  for (const video of allVideos) {
    if (!categories[video.category]) {
      categories[video.category] = [];
    }
    categories[video.category].push(video);
  }

  // Sort videos within each category by upload date (newest first)
  for (const category in categories) {
    categories[category].sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  return categories;
}

