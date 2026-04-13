import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoriesPageClient } from "../../../src/components/pages/Categories";
import { type Category } from "../../../src/lib/types";
import { DEFAULT_OG_IMAGE, getCategoryLabel } from "../../../src/lib/seo";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: Category }>;
}): Promise<Metadata> => {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory) as Category;
  const label = getCategoryLabel(category);
  const title = `${label} Catalog`;
  const description = `Browse ${label.toLowerCase()} available in the RE Commerce inventory.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${encodeURIComponent(category)}`,
    },
    openGraph: {
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
};

const CategoryPageContent = async ({
  params,
}: {
  params: Promise<{ category: Category }>;
}) => {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory) as Category;

  return <CategoriesPageClient category={category} />;
};

const CategoryPage = ({
  params,
}: {
  params: Promise<{ category: Category }>;
}) => {
  return (
    <div className="">
      <Suspense fallback={<p>Loading...</p>}>
        <CategoryPageContent params={params} />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
