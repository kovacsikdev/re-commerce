import { Suspense } from 'react';
import { ItemPageClient } from '../../../src/components/pages/Item';

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