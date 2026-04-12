import { Suspense } from "react";
import { CategoriesPageClient } from "../../../src/components/pages/Categories";
import { type Category } from "../../../src/lib/types";

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
