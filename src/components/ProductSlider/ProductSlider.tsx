"use client";
import Image from "next/image";
import { useState } from "react";
import "./ProductSlider.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { Navigation, FreeMode, Thumbs } from "swiper/modules";

type ProductSliderProps = {
  images: string[];
};

const ProductSlider: React.FC<ProductSliderProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [transform, setTransform] = useState("scale(1)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setTransform("scale(2)");
  };

  const handleMouseLeave = () => {
    setTransformOrigin("center center");
    setTransform("scale(1)");
  };

  return (
    <>
      <div className="product-page__slide_container">
        <Swiper thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} modules={[FreeMode, Navigation, Thumbs]} navigation={{ nextEl: ".product-page__arrow_next", prevEl: ".product-page__arrow_prev" }}>
          {images.map((image, index) => (
            <SwiperSlide className="product-page__slide_item" key={index} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div className="thumbnail-container">
                <Image className="product-page__slide_preview" loading="lazy" width={400} height={400} src={image} alt="" style={{ transformOrigin, transform }} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="product-page__nav">
          <button className="product-page__arrow product-page__arrow_prev">
            <Image className="product-page-arrow__icon" src="/images/icons/arrow-left.svg" width={20} height={20} alt="" aria-label="Кнопка слайдера" />
          </button>
          <button className="product-page__arrow product-page__arrow_next">
            <Image className="product-page-arrow__icon" src="/images/icons/arrow-right.svg" width={20} height={20} alt="" aria-label="Кнопка слайдера" />
          </button>
        </div>
      </div>
      <div className="product-page__galery" style={{ width: `${images.length > 5 ? 340 : images.length * 60 + (images.length - 1) * 10}px` }}>
        <Swiper style={{ width: `${images.length > 5 ? 340 : images.length * 60 + (images.length - 1) * 10}px` }} freeMode={true} watchSlidesProgress={true} onSwiper={setThumbsSwiper} slidesPerView={images.length > 5 ? 5 : images.length} spaceBetween={10} modules={[Navigation, FreeMode, Thumbs]} className="product-page__swiper">
          {images?.map((image, index) => (
            <SwiperSlide key={index} style={{ height: "60px" }}>
              <Image className="product-page__slide" width={60} height={60} src={image} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductSlider;
