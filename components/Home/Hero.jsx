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
import img1 from "@/src/images/main.png";
import img2 from "@/src/images/main.png";

const slides = [
    { href: "#!", src: img1, alt: "Main slide 1" },
    { href: "#!", src: img2, alt: "Main slide 2" },
];

export default function Hero() {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

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
                            // Attach shadcn buttons to Swiper navigation
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            swiper.params.navigation.prevEl = prevRef.current;
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        className="rounded-2xl"
                    >
                        {slides.map((s, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="relative overflow-hidden rounded-2xl">
                                    <Link href={s.href} className="block">
                                        <div className="relative h-[240px] w-full sm:h-[360px] md:h-[460px]">
                                            <Image
                                                src={s.src}
                                                alt={s.alt}
                                                fill
                                                priority={idx === 0}
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 1200px"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Prev / Next (shadcn) */}
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
