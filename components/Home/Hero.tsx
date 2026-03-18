"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/types/home";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroProps {
    banners: Banner[];
    isLoading?: boolean;
}

export default function Hero({ banners, isLoading }: HeroProps) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (isLoading) {
        return (
            <main className="w-full py-6">
                <div className="container">
                    <div className="relative">
                        <Skeleton className="h-[240px] w-full  rounded-2xl sm:h-[360px] md:h-[460px]" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full py-6">
            <div className="container">
                <div className="relative">
                    {/* Slider */}
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        loop
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // @ts-ignore
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-ignore
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        className="rounded-2xl"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <div className="relative overflow-hidden rounded-2xl">
                                    <Link href={banner.url} className="block" target="_blank" rel="noopener noreferrer">
                                        <div className="relative h-[240px] w-full sm:h-[360px] md:h-[460px]">
                                            <Image
                                                src={banner.image}
                                                alt={banner.title}
                                                fill
                                                priority={banner.id === banners[0]?.id}
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 1200px"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Prev / Next */}
                    <Button
                        ref={prevRef}
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow"
                        aria-label="Previous slide"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                        ref={nextRef}
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full shadow"
                        aria-label="Next slide"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </main>
    );
}
