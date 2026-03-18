"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <section className="content-section" dir="rtl">
      <div className="container">

        {/* ── upper-header: back btn + share/report ── */}
        <div className="upper-header">
          <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
          <div className="product-center">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
          </div>
        </div>

        <div className="product-detail">
          <div className="product--detail-grid">

            {/* ── slider-cont ── */}
            <div className="slider-cont">
              <div className="main-slider">
                {/* pro-swiper height matches real swiper */}
                <Skeleton className="pro-swiper h-[300px] w-full rounded-2xl sm:h-[380px]" />
              </div>
            </div>

            {/* ── detail-content ── */}
            <div className="detail-content">
              {/* detail-type */}
              <Skeleton className="h-4 w-32 rounded" />
              {/* detail-name */}
              <Skeleton className="h-7 w-3/4 rounded" />
              {/* price */}
              <Skeleton className="h-7 w-24 rounded" />
              {/* detail-date */}
              <Skeleton className="h-4 w-44 rounded" />

              {/* company-item */}
              <div className="company-item">
                <figure>
                  <Skeleton className="h-[46px] w-[46px] rounded-lg" />
                </figure>
                <div className="company-info">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              </div>
            </div>

            {/* ── detail-box: التفاصيل ── */}
            <div className="detail-box">
              <Skeleton className="title h-5 w-20 rounded" style={{ marginBottom: 16 }} />
              <div className="row-item">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="detail-item">
                    <Skeleton className="label h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── detail-box: الوصف ── */}
            <div className="detail-box">
              <Skeleton className="title h-5 w-16 rounded" style={{ marginBottom: 16 }} />
              <div className="desc flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            </div>

          </div>

          {/* ── contact-btns ── */}
          <div className="contact-btns">
            <Skeleton className="h-[50px] w-full rounded-[15px]" />
            <Skeleton className="h-[50px] w-full rounded-[15px]" />
          </div>
        </div>

      </div>
    </section>
  );
}
