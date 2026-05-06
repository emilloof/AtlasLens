"use client";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FloatingPin {
  id: number;
  city: string;
  x: number;
  y: number;
  delay: number;
}

interface SlideShowItem {
  id: number;
  title: string;
  description: string;
  imagePath: string;
}

export default function Home() {
  const [pins, setPins] = useState<FloatingPin[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideShowItem[] = [
    {
      id: 1,
      title: "Explore the Map",
      description: "Discover photos pinned across the globe",
      imagePath: "/screenshots/explore.jpg",
    },
    {
      id: 2,
      title: "Create Albums",
      description: "Organize memories by trip or city",
      imagePath: "/screenshots/albums.jpg",
    },
    {
      id: 3,
      title: "Share Moments",
      description: "Invite others to relive your adventures",
      imagePath: "/screenshots/share.jpg",
    },
    {
      id: 4,
      title: "Revisit Memories",
      description: "Interact with comments, likes, and filters",
      imagePath: "/screenshots/memories.jpg",
    },
  ];

  useEffect(() => {
    setMounted(true);
    // Initialize floating pins
    setPins([
      { id: 1, city: "Tokyo", x: 75, y: 35, delay: 0 },
      { id: 2, city: "Paris", x: 42, y: 28, delay: 0.2 },
      { id: 3, city: "Barcelona", x: 40, y: 32, delay: 0.4 },
      { id: 4, city: "Singapore", x: 68, y: 55, delay: 0.6 },
      { id: 5, city: "New York", x: 18, y: 25, delay: 0.8 },
      { id: 6, city: "Sydney", x: 82, y: 72, delay: 1.0 },
    ]);

    // Auto-advance slideshow every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className={styles.page}>
      {/* Atmospheric background layers */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.glow1}></div>
        <div className={styles.glow2}></div>
        <div className={styles.glow3}></div>
      </div>

      {/* Fullscreen map hero */}
      <section className={styles.mapHero}>
        <div className={styles.mapContainer}>
          <svg
            className={styles.mapSvg}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Simplified world map outline */}
            <defs>
              <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

          </svg>

          {/* Overlay content */}
          <div className={styles.mapOverlay}>
            <div className={styles.heroContent}>
              <div className={styles.tagline}>Revisit the world through your eyes</div>
              <h1 className={styles.preheroTitle}>Welcome To</h1>
              <h1 className={styles.heroTitle}> AtlasLens</h1>
              <p className={styles.heroSubtitle}>
                Every journey deserves to be remembered
              </p>

              <div className={styles.heroActions}>
                <Link href="/map" className={styles.ctaPrimary}>
                  <span>Start your journey</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 7h10v10M17 7L7 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/login" className={styles.ctaSecondary}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollDot}></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Journey highlights section */}
      <section className={styles.highlights}>
        <div className={styles.highlightsContent}>  
          <h2>How your memories come to life</h2>
          
          {/* Slideshow */}
          <div className={styles.slideshow}>
            <div className={styles.slideshowContainer}>
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
                >
                  <div className={styles.slideImage}>
                    <div className={styles.imagePlaceholder}>
                      {/* Replace with actual image when screenshots are available */}
                      <div className={styles.placeholderContent}>
                        <div className={styles.placeholderIcon}>📸</div>
                        <p>{slide.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.slideContent}>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <button
              className={styles.slidePrev}
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              className={styles.slideNext}
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Next slide"
            >
              →
            </button>

            {/* Dot indicators */}
            <div className={styles.slideDots}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <h2>Ready to map your memories?</h2>
          <p>Join travelers preserving their stories across the world</p>
          <Link href="/signup" className={styles.ctaPrimaryLarge}>
            Create your free account
          </Link>
        </div>
      </section>
    </div>
  );
}
