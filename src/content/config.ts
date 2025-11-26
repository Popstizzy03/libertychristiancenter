import { defineCollection, z } from 'astro:content';

const sermons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // This could be the main sermon title or a general identifier
    messageTitle: z.string().optional(), // The specific title of the sermon message
    subtitle: z.string().optional(), // A subtitle or theme for the message
    description: z.string().optional(), // A brief summary of the sermon
    preacher: z.string().default('Senior Pastor'),
    date: z.date(),
    series: z.string().optional(),
    youtube_id: z.string().optional(), // For embedding video
    audio_file: z.string().optional(), // For podcast style
    scripture: z.string(), // e.g., "John 3:16"
    lessons: z.array(z.string()).optional(), // Key takeaways or lessons from the sermon
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(), // Added: A detailed description of the event
    date: z.date(),
    endDate: z.date().optional(),
    payment: z.string().optional(),
    time: z.string(), // e.g., "10:00 AM"
    endTime: z.string().optional(), // Added: Optional end time for the event
    location: z.string().default('Main Sanctuary'),
    image: z.string().optional(),
    registration_link: z.string().optional(),
    organizer: z.string().optional(), // Added: Who is organizing the event
    category: z.array(z.enum(['fellowship', 'outreach', 'worship', 'youth', 'community', 'special', 'conference'])).optional(), // Added: Categories for the event
  }),
});

const ministries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    leader: z.string().optional(),
    meeting_time: z.string().optional(),
  }),
});

const newsletters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default('Communications Team'),
    image: z.string().optional(),
  }),
});

export const collections = { sermons, events, ministries, newsletters };