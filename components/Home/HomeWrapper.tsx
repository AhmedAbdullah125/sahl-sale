"use client";

import React from "react";
import Hero from "./Hero";
import HomeCategories from "./HomeCategories";
import MyBidsSection from "./MyBidsSection";
import BidsSection from "./BidsSection";
import CategoryProducts from "./CategoryProducts";
import { useGetHome } from "@/src/hooks/useGetHome";
import { Category } from "@/types/home";

export default function HomeWrapper() {
  const { data, isLoading, isError } = useGetHome("ar");

  const categories_with_ads: Category[] = data?.categories_with_ads ?? [];

  return (
    <div className="home-page-content">
      <Hero banners={data?.banners ?? []} />
      <HomeCategories categories={categories_with_ads ?? []} />
      <MyBidsSection />
      <BidsSection />
      {isLoading && (
        <div className="container py-8 text-center text-gray-400">جاري التحميل...</div>
      )}
      {isError && (
        <div className="container py-8 text-center text-red-500">حدث خطأ أثناء تحميل البيانات</div>
      )}
      {categories_with_ads.map((category) => (
        <CategoryProducts key={category.id} category={category} />
      ))}
    </div>
  );
}
