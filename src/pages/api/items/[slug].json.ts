import type { APIRoute } from 'astro';
import { getAllItems, getItemBySlug } from '../../../lib/items';

export async function getStaticPaths() {
  const items = getAllItems();
  return items.map((item) => ({
    params: { slug: item.slug },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const { slug } = params;
  const item = getItemBySlug(slug as string);
  
  if (!item) {
    return new Response(JSON.stringify({ error: "Item not found" }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  return new Response(JSON.stringify(item), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate'
    }
  });
};
