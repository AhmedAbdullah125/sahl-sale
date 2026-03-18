"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, PenLine, Trash2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FancyboxWrapper from "../ui/FancyboxWrapper";

interface ProductImage {
  url: string;
}

interface ProductImageSliderProps {
  id: string;
  images: ProductImage[];
  isMyProduct: boolean;
  isFav: boolean;
  isFavPending: boolean;
  expireText: string;
  onFavToggle: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function ProductImageSlider({
  id,
  images,
  isMyProduct,
  isFav,
  isFavPending,
  expireText,
  onFavToggle,
  onDeleteClick,
}: ProductImageSliderProps) {
  return (
    <div className="slider-cont">
      <main className="main-slider">
        <FancyboxWrapper>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={12}
            className="pro-swiper"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="main">
                  <div className="pro-img">
                    <a href={img.url} data-fancybox="gallery" className="w-full h-full">
                      <Image
                        src={img.url}
                        alt={`product-${idx + 1}`}
                        priority={idx === 0}
                        className="w-full h-auto"
                        width={500}
                        height={500}
                      />
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </FancyboxWrapper>
      </main>

      {!isMyProduct ? (
        <button
          type="button"
          className="add-fav"
          aria-label="Add to favorites"
          disabled={isFavPending}
          onClick={onFavToggle}
        >
          <Bookmark className={isFavPending ? "fill-current opacity-50" : isFav ? "fill-current" : ""} />
        </button>
      ) : (
        <>
          <Link className="edit-btn" aria-label="Edit" href={`/edit-product/${id}`}>
            <PenLine />
          </Link>

          <button type="button" className="delete-btn" aria-label="Delete" onClick={onDeleteClick}>
            <Trash2 />
          </button>

          <div className="detail-expire">{expireText}</div>
        </>
      )}
    </div>
  );
}
