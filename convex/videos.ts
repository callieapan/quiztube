import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { vid } from './util';

// export const addVideo = mutation({
//   args: {
//     name: v.string(),
//     iconId: v.optional(v.string()),
//     category: v.string(),
//     link: v.string(),
//     folderId: v.optional(vid('folders')),
//     planId: vid('plans'),
//   },
//   handler: async (ctx, args) => {
//     const accessObj = await hasAccessToMutatePlan(ctx, args.planId);

//     if (!accessObj) {
//       return {
//         error: 'No access to create resource on this plan',
//       };
//     }

//     await ctx.db.insert('resources', {
//       name: args.name,
//       iconId: args.iconId,
//       category: args.category,
//       link: args.link,
//       planId: args.planId,
//       folderId: args.folderId,
//     });
//   },
// });

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
    args: { userId: vid( 'users' ) },
    
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query('videos')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    return videos;
  },
});
