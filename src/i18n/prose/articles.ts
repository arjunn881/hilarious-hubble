/**
 * Translation overlay for the 51 markdown guide bodies.
 *
 * A guide is a plain markdown file with frontmatter, globbed at build time. The
 * body is long-form editorial prose, so it is translated as a whole file rather
 * than string by string:
 *
 *   src/data/articles/<slug>.md          English original  (always present)
 *   src/data/articles/<lang>/<slug>.md   translation       (add as available)
 *
 * The translated file keeps the same slug — so the URL is unchanged — and its
 * own frontmatter, so `title`, `description` and `lastUpdated` localize with the
 * body. Any guide without a file for the active locale renders the English one.
 *
 * `import.meta.glob` has to be called from the page that consumes it, so pages
 * pass their glob result to `indexArticleOverlay` and then read through
 * `pickArticle`.
 */
import type { Lang } from '../config';

/** The shape `import.meta.glob(..., { eager: true })` yields for a markdown file. */
export interface ArticleModule {
  default: unknown;
  frontmatter: Record<string, unknown>;
}

/** `<slug>` for `foo/bar/knife-on-plane.md`. */
export function articleSlug(filePath: string): string {
  const parts = filePath.split(/[/\\]/);
  return parts[parts.length - 1].replace(/\.md$/, '');
}

/**
 * Indexes a localized-article glob by `"<lang>/<slug>"`.
 *
 * Pass the eager `import.meta.glob` result for the one-directory-deep markdown
 * pattern under `data/articles` — the directory name is taken as the locale.
 */
export function indexArticleOverlay(globbed: Record<string, unknown>): Map<string, ArticleModule> {
  const index = new Map<string, ArticleModule>();
  for (const [filePath, module] of Object.entries(globbed)) {
    const parts = filePath.split(/[/\\]/);
    const dir = parts[parts.length - 2];
    if (dir) index.set(`${dir}/${articleSlug(filePath)}`, module as ArticleModule);
  }
  return index;
}

/** The translated article for `slug` in `lang`, or `english` when there is none. */
export function pickArticle<T>(
  overlay: Map<string, ArticleModule>,
  slug: string,
  lang: Lang,
  english: T,
): T {
  if (lang === 'en' || overlay.size === 0) return english;
  return (overlay.get(`${lang}/${slug}`) as T | undefined) ?? english;
}
