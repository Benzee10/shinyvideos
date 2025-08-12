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

// Function to parse markdown content into a Video object
const parseMarkdownToVideo = (markdown: string): Omit<Video, 'uploadDate'> | null => {
  if (!markdown.trim()) return null;

  const lines = markdown.split('\n');
  let title = '';
  let videoUrl = '';
  let thumbnail = '';
  let duration = '';
  let tags: string[] = [];
  let description = '';

  // Extract title from first line (remove # and trim)
  const titleLine = lines.find(line => line.startsWith('# '));
  if (titleLine) {
    title = titleLine.replace('# ', '').trim();
  }

  // Extract other fields
  for (const line of lines) {
    if (line.startsWith('**Video URL:**')) {
      videoUrl = line.replace('**Video URL:**', '').trim();
    } else if (line.startsWith('**Thumbnail:**')) {
      thumbnail = line.replace('**Thumbnail:**', '').trim();
    } else if (line.startsWith('**Duration:**')) {
      duration = line.replace('**Duration:**', '').trim();
    } else if (line.startsWith('**Tags:**')) {
      const tagString = line.replace('**Tags:**', '').trim();
      tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    } else if (line.startsWith('**Description:**')) {
      description = line.replace('**Description:**', '').trim();
    }
  }

  if (!title || !videoUrl) {
    return null;
  }

  return {
    slug: createSlug(title),
    title,
    thumbnail,
    videoUrl,
    duration,
    tags,
    description: description === '.' ? '' : description,
  };
};

// Function to add upload date to video
const addUploadDateToVideo = (video: Omit<Video, 'uploadDate'>): Video => ({
  ...video,
  uploadDate: new Date().toISOString().split('T')[0],
});

// Function to load videos from markdown files
async function loadVideosFromFiles(): Promise<Video[]> {
  const allVideos: Video[] = [];

  try {
    // Import all markdown files from all folders (supports unlimited nesting)
    const moduleFiles = import.meta.glob('/lib/data/**/*.md', {
      as: 'raw',
      eager: false
    });

    for (const [path, moduleLoader] of Object.entries(moduleFiles)) {
      try {
        const content = await moduleLoader();
        const video = parseMarkdownToVideo(content);

        if (video) {
          allVideos.push(addUploadDateToVideo(video));
        }
      } catch (fileError) {
        console.warn(`Could not load video file ${path}:`, fileError);
      }
    }
  } catch (error) {
    console.warn('Error loading video files:', error);
  }

  return allVideos;
}

// Static video markdown content
const melissaStrattonCulinaryMd = `# Melissa Stratton prepares a culinary masterpiece in the kitchen before satisfying her appetite in a different way

**Video URL:** https://www.xerotica.com/embed/58449
**Thumbnail:** https://i.postimg.cc/6qBSZvgV/b9c9beea2acea1aef3fa8d8c4b0af6bf-mp4-3-1280.jpg
**Duration:** 04:00
**Tags:** Melissa Stratton, Kitchen, Blonde, Masturbation, Culinary
**Description:** .`;

const melissaStrattonBathtubMd = `# Melissa Stratton's bathtub becomes a stage for sensual self-discovery as she explores her desires

**Video URL:** https://www.xerotica.com/embed/58448
**Thumbnail:** https://i.postimg.cc/B6yqVNCL/21d31b9b5b6e63f31f6e5f584fba72b9-mp4-4-1280.jpg
**Duration:** 04:01
**Tags:** Melissa Stratton, Bathtub, Blonde, Masturbation, Wet
**Description:** .`;

const melissaStrattonSwimsuitMd = `# Melissa Stratton strips out of her swimsuit to reveal her stunning curves

**Video URL:** https://www.xerotica.com/embed/58447
**Thumbnail:** https://i.postimg.cc/wMqkGF7g/6e4b2b6a8c5e2b4a2b3c7a8d9e5f7b9c-mp4-2-1280.jpg
**Duration:** 03:45
**Tags:** Melissa Stratton, Swimsuit, Blonde, Strip Tease, Pool
**Description:** .`;

const nikoletaBlondeStripsMd = `# Nikoleta's blonde beauty shines as she strips down to reveal her perfect form

**Video URL:** https://www.xerotica.com/embed/58445
**Thumbnail:** https://i.postimg.cc/7PtLmNdR/nikoleta-blonde-strips-thumb.jpg
**Duration:** 04:15
**Tags:** Nikoleta, Blonde, Strip Tease, European, Solo
**Description:** .`;

const nikoletaLesbianCouchMd = `# Nikoleta and her girlfriend explore their desires on the couch in passionate lesbian encounter

**Video URL:** https://www.xerotica.com/embed/58444
**Thumbnail:** https://i.postimg.cc/J7nBbGtR/nikoleta-lesbian-couch-thumb.jpg
**Duration:** 05:30
**Tags:** Nikoleta, Lesbian, Couch, Blonde, European
**Description:** .`;

const nikoletaSqueakyCleanMd = `# Nikoleta gets squeaky clean in the shower before getting dirty again

**Video URL:** https://www.xerotica.com/embed/58443
**Thumbnail:** https://i.postimg.cc/mDqJxGBn/nikoleta-squeaky-clean-thumb.jpg
**Duration:** 03:55
**Tags:** Nikoleta, Shower, Blonde, Wet, Solo
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

// Static video data
const staticVideoData: string[] = [
  melissaStrattonCulinaryMd,
  melissaStrattonBathtubMd,
  melissaStrattonSwimsuitMd,
  nikoletaBlondeStripsMd,
  nikoletaLesbianCouchMd,
  nikoletaSqueakyCleanMd,
  nikoletaClemenceAudiardMd,
  nikoletaCatalinaMonteMd,
  sashaEMd,
];

export function getAllVideos(): Video[] {
  const staticVideos = staticVideoData.map(markdownContent => {
    const video = parseMarkdownToVideo(markdownContent);
    return video ? addUploadDateToVideo(video) : null;
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

export async function getVideoBySlugWithDynamic(slug: string): Promise<Video | undefined> {
  const allVideos = await getAllVideosWithDynamic();
  return allVideos.find(v => v.slug === slug);
}

export function getAllTags(): string[] {
  const allVideos = getAllVideos();
  const tagSet = new Set<string>();

  for (const video of allVideos) {
    for (const tag of video.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export async function getAllTagsWithDynamic(): Promise<string[]> {
  const allVideos = await getAllVideosWithDynamic();
  const tagSet = new Set<string>();

  for (const video of allVideos) {
    for (const tag of video.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}