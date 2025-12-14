import React, { useEffect, useState } from 'react'
import './Gallery.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'
// Load all images from the public Gallery folder without using JSON
// Vite supports import.meta.glob to include assets at build time
const imageModules = import.meta.glob('/public/Pic/Gallery/*.{jpg,jpeg,png}', { eager: true, as: 'url' })
const images = Object.values(imageModules)

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [galleryRef, galleryVisible] = useStaggerAnimation(images.length, 50);

  const filteredItems = images

  const openLightbox = (item) => {
    setSelectedImage(item)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  // Close on ESC key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    if (selectedImage) {
      window.addEventListener('keydown', onKeyDown)
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedImage])

  const nextImage = () => {
    const currentIndex = filteredItems.findIndex(item => item === selectedImage)
    const nextIndex = (currentIndex + 1) % filteredItems.length
    setSelectedImage(filteredItems[nextIndex])
  }

  const prevImage = () => {
    const currentIndex = filteredItems.findIndex(item => item === selectedImage)
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length
    setSelectedImage(filteredItems[prevIndex])
  }

  return (
    <div className="gallery-page">
      <header className="gallery-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>Our Memories</p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>Photo Gallery</h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            Explore moments from our events, projects, and community activities. 
            Each photo tells a story of service, friendship, and positive impact.
          </p>
        </div>
      </header>

      <main>
        <section className="gallery-content">
          <div className="container">
            {/* Simple Gallery Grid (thumbnails only) */}
            <div className="gallery-grid" ref={galleryRef}>
              {filteredItems.map((item, index) => (
                <button 
                  key={item}
                  className={`gallery-item gallery-item-animation ${galleryVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}
                  onClick={() => openLightbox(item)}
                  aria-label="View image"
                >
                  <div className="gallery-image">
                    <img src={item} alt="" loading="lazy" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Submission CTA
        <section className="photo-submission-section">
          <div className="container">
            <div className="submission-content">
              <h2>Share Your Leo Moments</h2>
              <p>
                Have photos from our events or projects? We'd love to feature them in our gallery! 
                Help us document our journey and celebrate our achievements together.
              </p>
              <button className="submit-photos-btn">Submit Photos</button>
            </div>
          </div>
        </section> */}
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeLightbox}>×</button>
            <button className="nav-btn prev-btn" onClick={prevImage}>‹</button>
            <button className="nav-btn next-btn" onClick={nextImage}>›</button>
            
            <div className="lightbox-image">
              <img src={selectedImage} alt="" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
