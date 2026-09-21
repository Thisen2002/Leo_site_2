import React, { useEffect, useState } from 'react'
import './Gallery.css'
import '../utils/scrollAnimations.css'
import { supabase } from '../utils/supabase'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching gallery:', error)
      } else {
        setImages(data || [])
      }
      setLoading(false)
    }

    fetchGallery()
  }, [])

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [galleryRef, galleryVisible] = useStaggerAnimation(images.length || 1, 50);

  const getImageUrl = (path) => {
    if (!path) return ''
    return supabase.storage.from('gallery-images').getPublicUrl(path).data.publicUrl
  }

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
    const currentIndex = images.findIndex(item => item.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

  const prevImage = () => {
    const currentIndex = images.findIndex(item => item.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                Loading gallery...
              </div>
            ) : (
              <div className="gallery-grid" ref={galleryRef}>
                {images.map((item, index) => (
                  <button 
                    key={item.id}
                    className={`gallery-item gallery-item-animation ${galleryVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}
                    onClick={() => openLightbox(item)}
                    aria-label="View image"
                  >
                    <div className="gallery-image">
                      <img src={getImageUrl(item.image_url)} alt="Gallery Image" loading="lazy" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeLightbox}>×</button>
            <button className="nav-btn prev-btn" onClick={prevImage}>‹</button>
            <button className="nav-btn next-btn" onClick={nextImage}>›</button>
            
            <div className="lightbox-image">
              <img src={getImageUrl(selectedImage.image_url)} alt="Enlarged gallery view" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
