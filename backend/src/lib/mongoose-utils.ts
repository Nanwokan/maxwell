import { Types, type Model } from 'mongoose';

import { HttpError } from './http-error';

export function ensureObjectId(id: string): string {
  if (!Types.ObjectId.isValid(id)) {
    throw new HttpError(400, 'Invalid resource id');
  }
  return id;
}

export async function findByIdOrFail<TDocument>(
  model: Model<TDocument>,
  id: string,
  label: string
): Promise<TDocument> {
  const item = await model.findById(ensureObjectId(id));
  if (!item) {
    throw new HttpError(404, `${label} not found`);
  }
  return item;
}
