import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import ListingItem from "../Listings/ListingItem";

const ListingArea = ({ listings }) => { 
  return (
    <>
      <section className="main-listings-area listings-area ptb-100 bg-f9f9f9">
        <div className="container">
          <div className="section-title">
            <h2>Trending Listings Right Now</h2>
          </div>

          <Swiper
            spaceBetween={25}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination]}
            className="listings-slides"
          >
            {listings.map((listing, index) => {
              const styles = { display: "flex", height: "auto" };
              return (
                <SwiperSlide key={listing.id} style={styles}>
                  <ListingItem listing={listing} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="divider2"></div>
      </section>
    </>
  );
};

export default ListingArea;
