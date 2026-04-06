import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string | number;
  src: string;
  alt: string;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function BannerSlider({
  banners,
  autoPlay = true,
  autoPlayInterval = 4000
}: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= banners.length && banners.length > 0) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  useEffect(() => {
    if (!autoPlay || banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {banners.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 h-64 md:h-80 flex items-center justify-center">
          <p className="text-white/30 text-sm">No banners uploaded yet</p>
        </div>
      ) : (
      <>
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 h-64 md:h-80">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={banners[currentIndex].src}
              alt={banners[currentIndex].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
          aria-label="Previous banner"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
          aria-label="Next banner"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex
                ? 'bg-[#6C4DFF]'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
      </>
      )}
    </div>
  );
}