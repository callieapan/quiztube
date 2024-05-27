import { GenericId, v, Validator } from 'convex/values';

import { TableNames } from './_generated/dataModel';
import { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';

export function vid<TableName extends TableNames>(
  tableName: TableName,
): Validator<GenericId<TableName>> {
  return v.id(tableName);
}

export async function getUserId(ctx: QueryCtx | ActionCtx | MutationCtx) {
  return (await ctx.auth.getUserIdentity())?.subject;
}

export function formatName(
  firstName?: string | null,
  lastName?: string | null,
) {
  firstName = firstName ?? '';
  lastName = lastName ?? '';
  let combinedName = `${firstName} ${lastName}`.trim();
  if (combinedName === '') {
    combinedName = 'Anonymous';
  }
  return combinedName;
}

export function getYouTubeId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
