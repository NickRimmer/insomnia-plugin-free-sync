import { PathLike } from 'fs';
import { stat } from 'fs/promises';

export const validatePath = (path: string | null | undefined): boolean =>
  path !== null &&
  path !== undefined &&
  path.length > 0 &&
  new RegExp(
    '^(?:[a-z]:)?[\\/\\\\]{0,2}(?:[.\\/\\\\ ](?![.\\/\\\\\\n])|[^<>:"|?*.\\/\\\\ \\n])+$', 'gmi')
    .exec(path) !== null

export async function exists(f : PathLike) {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
}