'use client';

import React from 'react';
import { Carousel } from 'antd';
import { ArrowLeft, ArrowRight } from '@/lib/const/icons';
import { Box } from '../wrappers/box';

// Common Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="border-smoke absolute top-1/2 -left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-lg transition hover:bg-gray-100"
  >
    <ArrowLeft className="text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="border-smoke absolute top-1/2 -right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-lg transition hover:bg-gray-100"
  >
    <ArrowRight className="text-gray-700" />
  </button>
);

/**
 * Common Image Gallery Component
 *
 * @param {string[]} images - List of image URLs for thumbnails.
 * @param {string} mainImage - Main product image URL.
 * @param {function} onImageClick - Optional callback when thumbnail is clicked.
 * @param {boolean} showDots - Whether to show carousel dots.
 */
const ImageGallery = ({ images = [], mainImage, showDots = false }) => {
  return (
    <Box>
      {/* Main Image */}
      {mainImage && (
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
          <div className="relative aspect-square w-full bg-gray-50">
            <img src={mainImage} alt="Main Product" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Thumbnail Carousel */}
      {images.length > 0 && (
        <div className="relative">
          <Carousel
            arrows
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
            dots={showDots}
            slidesToShow={4}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 640, settings: { slidesToShow: 2 } },
            ]}
          >
            {images.map((img, i) => (
              <div key={i} className="px-2">
                <button className="border-smoke block w-full overflow-hidden rounded-lg border transition-all hover:opacity-90">
                  <div className="relative aspect-square">
                    <img
                      src={img}
                      alt={`Gallery image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </Box>
  );
};

export default ImageGallery;
