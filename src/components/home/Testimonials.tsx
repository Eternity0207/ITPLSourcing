"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { TESTIMONIALS } from "@/data/site";
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-text md:text-3xl">
            4000+ clients trust ITPLSourcing
          </h2>
          <p className="text-text-muted">Clients worldwide share their thoughts about us</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="card-shadow h-full rounded-2xl bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={50}
                    height={50}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-text">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-text-muted">{t.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
