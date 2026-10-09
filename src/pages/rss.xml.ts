import type { APIRoute } from 'astro';

export const prerender = true;

const SITE = 'https://bringonplane.com';

export const GET: APIRoute = async () => {
  const posts = import.meta.glob('../data/articles/*.md', { eager: true });
  
  const articles = Object.entries(posts).map(([filePath, module]: [string, any]) => {
    const parts = filePath.split(/[/\\]/);
    const filename = parts[parts.length - 1];
    const slug = filename.replace('.md', '');
    return {
      slug,
      frontmatter: module.frontmatter || {},
    };
  })
  .sort((a, b) => (b.frontmatter.lastUpdated || '').localeCompare(a.frontmatter.lastUpdated || ''));

  const now = new Date().toUTCString();

  function escapeXml(unsafe: string): string {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const itemsXml = articles.map((article) => {
    const fm = article.frontmatter;
    const title = escapeXml(fm.title || article.slug);
    const description = escapeXml(fm.description || '');
    const url = `${SITE}/guide/${article.slug}/`;
    const category = escapeXml(fm.category || 'Travel Security');
    const pubDate = fm.lastUpdated ? new Date(fm.lastUpdated).toUTCString() : now;
    const imagePath = fm.image || '/og-image.png';
    const imageUrl = new URL(imagePath, SITE).href;

    return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>BringOnPlane Aviation &amp; Security Desk</dc:creator>
      <category>${category}</category>
      <description>${description}</description>
      <media:content url="${imageUrl}" medium="image" width="1200" height="675" />
      <enclosure url="${imageUrl}" length="750000" type="image/jpeg" />
    </item>`;
  }).join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>BringOnPlane — Airport Security &amp; Carry-On Baggage Updates</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Official TSA rules, FAA regulations, viral airport security debates, and carry-on packing guides.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <image>
      <url>${SITE}/og-image.png</url>
      <title>BringOnPlane</title>
      <link>${SITE}/</link>
      <width>144</width>
      <height>144</height>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
