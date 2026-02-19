import React from "react";
import Hero from "./Hero";
import HomeCategories from "./HomeCategories";
import MyBidsSection from "./MyBidsSection";
import BidsSection from "./BidsSection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import MotorsProductsSection from "./MotorsProductsSection";
import EstateProductsSection from "./EstateProductsSection";
import ElectronicsProductsSection from "./ElectronicsProductsSection";
import BuySellProductsSection from "./BuySellProductsSection";
import ContractingProductsSection from "./ContractingProductsSection";
import JobsProductsSection from "./JobsProductsSection";
export default function HomeWrapper() {
  
  return (
    <div className="home-page-content">
      <Hero/>
      <HomeCategories />
      <MyBidsSection />
      <BidsSection />
      <FeaturedProductsSection />
      <MotorsProductsSection />
      <EstateProductsSection />
      <ElectronicsProductsSection />
      <BuySellProductsSection />
      <ContractingProductsSection />
      <JobsProductsSection />
    </div>
  )
}
