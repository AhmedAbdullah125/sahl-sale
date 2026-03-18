"use client";

import Hero from "./Hero";
import HomeCategories from "./HomeCategories";
import MyBidsSection from "./MyBidsSection";
import BidsSection from "./BidsSection";
import CategoryProducts, { CategoryProductsSkeletonList } from "./CategoryProducts";
import { useGetHome } from "@/src/hooks/useGetHome";
import { Category } from "@/types/home";

export default function HomeWrapper() {
  const { data, isLoading, isError } = useGetHome("ar");

  if (isError) {
    return (
      <div className="container py-8 text-center text-red-500">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );
  }

  const categories_with_ads: Category[] = data?.categories_with_ads ?? [];

  const allHomePageCategories: Category[] = [
    {
      id: 0,
      name: "الاعلانات المميزه",
      ads: data?.pinned_ads ?? [],
      slug: "pinned",
    } as Category,
    ...categories_with_ads,
  ];

  return (
    <div className="home-page-content">
      <Hero banners={data?.banners ?? []} isLoading={isLoading} />
      <HomeCategories categories={categories_with_ads ?? []} isLoading={isLoading} />
      <MyBidsSection bids={data?.["my-bids"] ?? []} isLoading={isLoading} />
      <BidsSection auctions={data?.auctions ?? []} isLoading={isLoading} />

      {isLoading ? (
        <CategoryProductsSkeletonList />
      ) : (
        allHomePageCategories.map((category) =>
          category.ads.length > 0 && (
            <CategoryProducts key={category.id} category={category} />
          )
        )
      )}
    </div>
  );
}
