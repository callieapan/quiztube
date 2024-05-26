import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    endsOn: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
    .index('by_email', ['email']),
  videos: defineTable({
    videoId: v.string(), // Unique identifier for each video
    youtubeVideoId: v.string(), // The YouTube ID of the video
    title: v.string(), // The title of the video
    thumbnailUrl: v.string(), // URL for the thumbnail image
    description: v.optional(v.string()), // A brief description of the video
    userId: v.string(),
  })
    .index('by_videoId', ['videoId'])
    .index('by_userId', ['userId']),
});
