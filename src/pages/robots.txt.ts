import type { APIRoute } from 'astro';

const SITE = 'https://bringonplane.com';

const ROBOTS_CONTENT = `# =============================================================================
# BringOnPlane — robots.txt
# https://bringonplane.com
# =============================================================================
# This file controls how search engine crawlers access bringonplane.com.
# It follows the Robots Exclusion Standard (REP) and Google's extended rules.
# =============================================================================

# ─────────────────────────────────────────────────────────────────────────────
# 1. GOOGLEBOT — Primary search crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: Googlebot
Allow: /
Disallow: /404
Disallow: /500
Disallow: /api/
Disallow: /*.json$
Disallow: /items/page/
Crawl-delay: 1

# ─────────────────────────────────────────────────────────────────────────────
# 2. GOOGLEBOT-IMAGE — Google Images crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: Googlebot-Image
Allow: /

# ─────────────────────────────────────────────────────────────────────────────
# 3. BINGBOT — Microsoft Bing crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: bingbot
Allow: /
Disallow: /404
Disallow: /500
Disallow: /api/
Disallow: /*.json$
Crawl-delay: 2

# ─────────────────────────────────────────────────────────────────────────────
# 4. SLURP — Yahoo! crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: Slurp
Allow: /
Disallow: /404
Disallow: /500
Disallow: /api/
Crawl-delay: 5

# ─────────────────────────────────────────────────────────────────────────────
# 5. DUCKDUCKBOT — DuckDuckGo crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: DuckDuckBot
Allow: /
Disallow: /404
Disallow: /500
Disallow: /api/
Crawl-delay: 2

# ─────────────────────────────────────────────────────────────────────────────
# 6. FACEBOT — Facebook / Meta crawler (link previews, Open Graph)
# ─────────────────────────────────────────────────────────────────────────────
User-agent: facebookexternalhit
Allow: /

# ─────────────────────────────────────────────────────────────────────────────
# 7. TWITTERBOT — Twitter/X card crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: Twitterbot
Allow: /

# ─────────────────────────────────────────────────────────────────────────────
# 8. LINKEDINBOT — LinkedIn preview crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: LinkedInBot
Allow: /

# ─────────────────────────────────────────────────────────────────────────────
# 9. APPLEBOT — Apple Spotlight & Siri crawler
# ─────────────────────────────────────────────────────────────────────────────
User-agent: Applebot
Allow: /
Disallow: /api/

# ─────────────────────────────────────────────────────────────────────────────
# 10. AI / LLM CRAWLERS
# ─────────────────────────────────────────────────────────────────────────────
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

# ─────────────────────────────────────────────────────────────────────────────
# 11. SEO TOOL CRAWLERS (research / competitive analysis tools)
# ─────────────────────────────────────────────────────────────────────────────
User-agent: AhrefsBot
Allow: /
Crawl-delay: 10

User-agent: SemrushBot
Allow: /
Crawl-delay: 10

User-agent: MJ12bot
Allow: /
Crawl-delay: 10

User-agent: DotBot
Allow: /
Crawl-delay: 10

# ─────────────────────────────────────────────────────────────────────────────
# 12. AGGRESSIVE / UNWANTED BOTS — Block completely
# ─────────────────────────────────────────────────────────────────────────────
User-agent: SiteAuditBot
Disallow: /

User-agent: AhrefsSiteAudit
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: DataForSeoBot
Allow: /
Crawl-delay: 30

# ─────────────────────────────────────────────────────────────────────────────
# 13. DEFAULT RULES — Applies to any crawler not listed above
# ─────────────────────────────────────────────────────────────────────────────
User-agent: *
Allow: /
Disallow: /404
Disallow: /500
Disallow: /api/
Disallow: /*.json$
Disallow: /items/page/
Crawl-delay: 5

# =============================================================================
# SITEMAP DECLARATIONS
# =============================================================================
Sitemap: ${SITE}/sitemap-index.xml
`;

export const GET: APIRoute = () => {
  return new Response(ROBOTS_CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
