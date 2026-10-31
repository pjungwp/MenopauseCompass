/**
 * Optional shared "Look" (skins from the app-skins pack). Visual only; saved per device.
 * With no Look chosen the app keeps its own colours exactly.
 */
import { applySkin, isSkin } from 'app-skins';
import { safeLocal } from '@/lib/storage';

export const LOOK_KEY = 'mc.skin';
const DEFAULT_THEME_COLOR = '#173D40';

export function getLook(): string {
  const v = safeLocal.get<string>(LOOK_KEY, '');
  return isSkin(v) ? v : '';
}

export function applyLook(id: string) {
  if (isSkin(id)) {
    applySkin(id);
    return;
  }
  if (document.documentElement.dataset.skin) {
    applySkin(null);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', DEFAULT_THEME_COLOR);
  }
}

export function setLook(id: string) {
  if (id) safeLocal.set(LOOK_KEY, id);
  else safeLocal.remove(LOOK_KEY);
  applyLook(id);
}
