'use client';

import React, { useState } from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ProductImageGallery = () => {
  const [mainImage, setMainImage] = useState('/bundle-main.jpg'); // Default main bundle image

  // Additional product images
  const additionalImages = [
    'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616694677520-9d996e40a4c8?w=400&h=400&fit=crop',
    // Add more images as needed
  ];

  // Custom arrow components for carousel
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-gray-100"
        onClick={onClick}
      >
        <LeftOutlined className="text-gray-700" />
      </button>
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:bg-gray-100"
        onClick={onClick}
      >
        <RightOutlined className="text-gray-700" />
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
      {/* Main Bundle Image */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
        <div className="relative aspect-square w-full bg-gray-50">
          <Image src={mainImage} alt="Product Bundle" fill className="object-cover" priority />
        </div>
        <h2 className="mt-4 text-center text-2xl font-semibold text-gray-800">Bundle Image</h2>
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative">
        <Carousel
          arrows
          prevArrow={<PrevArrow />}
          nextArrow={<NextArrow />}
          dots={true}
          slidesToShow={4}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 1024,
              settings: { slidesToShow: 3 },
            },
            {
              breakpoint: 640,
              settings: { slidesToShow: 2 },
            },
          ]}
        >
          {additionalImages.map((img, index) => (
            <div key={index} className="px-2">
              <button
                onClick={() => setMainImage(img)}
                className={`block w-full overflow-hidden rounded-lg border-2 transition-all ${
                  mainImage === img
                    ? 'scale-105 border-green-600 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="relative aspect-square">
                  <img src={img} alt={`Product view ${index + 1}`} fill className="object-cover" />
                </div>
              </button>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Optional: View in 360° or Zoom hint */}
      <p className="mt-4 text-center text-sm text-gray-500">
        Click any image to view larger • Swipe to see more
      </p>
    </div>
  );
};

export default ProductImageGallery;
