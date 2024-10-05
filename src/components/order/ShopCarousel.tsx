import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ShopCarousel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Skeleton className="h-24 md:h-64" />;
  return (
    <div className="">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showArrows={false}
        showThumbs={false}
        swipeable={true}
        transitionTime={500}
        interval={4000}
        className="rounded-2xl overflow-hidden shop shadow-lg"
      >
        <div className="relative">
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full pointer-events-none"
            loading="lazy"
            src="/banner.png"
          />
        </div>
        <div>
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full"
            loading="lazy"
           src="/banner.png"
          />
        </div>
        <div>
          <img
            className=" bg-white h-24 object-cover md:h-64 w-full"
            loading="lazy"
            src="/banner.png"
          />
        </div>
      </Carousel>
    </div>
  );
}

export default ShopCarousel;
