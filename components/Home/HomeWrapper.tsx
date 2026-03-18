"use client";

import Hero from "./Hero";
import HomeCategories from "./HomeCategories";
import MyBidsSection from "./MyBidsSection";
import BidsSection from "./BidsSection";
import CategoryProducts from "./CategoryProducts";
import { useGetHome } from "@/src/hooks/useGetHome";
import { Category } from "@/types/home";
import Loading from "@/src/app/loading";

export default function HomeWrapper() {
  const { data, isLoading, isError } = useGetHome("ar");

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
      <Hero banners={data?.banners ?? []} />
      <HomeCategories categories={categories_with_ads ?? []} />
      <MyBidsSection bids={data?.["my-bids"] ?? []} />
      <BidsSection auctions={data?.auctions ?? []} />

      {isLoading && (
        <Loading />
      )}
      {isError && (
        <div className="container py-8 text-center text-red-500">حدث خطأ أثناء تحميل البيانات</div>
      )}


      {allHomePageCategories.map((category) => (
        category.ads.length > 0 && (
          <CategoryProducts key={category.id} category={category} />
        )
      ))}

    </div>
  );
}
