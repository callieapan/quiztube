import { v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { vid } from './util';

export const addVideo = mutation({
  args: {
    videoUrl: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    function getYouTubeId(url: string): string | null {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }
    const youtubeId = getYouTubeId(args.videoUrl);

    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

    await ctx.db.insert('videos', {
      videoUrl: args.videoUrl,
      thumbnailUrl: thumbnailUrl,
      userId: args.userId as Id<'users'>,
      videoId: youtubeId as string,
    });
  },
});

// export const updateVideo = mutation({
//   args: {
//     resourceId: vid('resources'),
//     name: v.optional(v.string()),
//     category: v.optional(v.string()),
//     link: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const accessObj = await hasAccessToResource(ctx, args.resourceId);

//     if (!accessObj) {
//       return {
//         error: 'No access to create work items on this plan.',
//       };
//     }

//     let toUpdate = {} as any;

//     if (args.name) toUpdate.name = args.name;
//     if (args.category) toUpdate.category = args.category;
//     if (args.link) toUpdate.link = args.link;

//     await ctx.db.patch(args.resourceId, toUpdate);
//   },
// });

// export const deleteVideo = mutation({
//   args: { resourceId: vid('resources') },
//   handler: async (ctx, args) => {
//     const resource = await ctx.db.get(args.resourceId);
//     if (!resource) {
//       throw new Error('work item not found');
//     }

//     const accessObj = await hasAccessToMutatePlan(ctx, resource.planId);

//     if (!accessObj) {
//       throw new Error('no have no access to this plan');
//     }

//     return await ctx.db.delete(resource._id);
//   },
// });

export const getVideo = query({
  args: { videoId: vid('videos') },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) {
      throw new Error('work item not found');
    }

    return video;
  },
});

export const getVideos = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    if (args.userId) {
      const videos = await ctx.db
        .query('videos')
        .withIndex('by_userId', (q) => q.eq('userId', args.userId))
        .collect();
      return videos;
    }
  },
});
