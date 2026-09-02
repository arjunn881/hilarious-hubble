/**
 * Spanish (es) item prose — slug → translated regulatory copy.
 *
 * Sparse on purpose: see `./index.ts`. An item that is absent here, or an
 * entry that omits a field, renders the English source text. Fill this in item
 * by item; nothing else needs to change.
 *
 * Shape:
 *
 *   'aa-batteries': {
 *     carryOnReason: '…',
 *     carryOnConditions: ['…', '…'],
 *     checkedReason: '…',
 *     travelTips: ['…'],
 *   },
 *
 * Slugs must match `src/data/metadata-summary.json`.
 */
import type { ProseOverlay } from './index';

export const es: ProseOverlay = {};
