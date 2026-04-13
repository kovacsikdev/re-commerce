import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ItemPageClient } from '../../../src/components/pages/Item';
import { fetchItemById } from '../../../src/lib/product-api';
import { DEFAULT_OG_IMAGE } from '../../../src/lib/seo';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  try {
    const item = await fetchItemById(id);
    const title = item.name;
    const description = item.short_description || item.description;
    const image = item.img_hero_url || DEFAULT_OG_IMAGE;

    return {
      title,
      description,
      alternates: {
        canonical: `/item/${encodeURIComponent(id)}`,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        images: [image],
      },
    };
  } catch {
    return {
      title: 'Item Not Found',
      description: 'The requested item could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
};

const ItemPageContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  return <ItemPageClient itemId={id} />;
};

const ItemPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="">
      <Suspense fallback={<p>Loading...</p>}>
        <ItemPageContent params={params} />
      </Suspense>
    </div>
  );
};

export default ItemPage;