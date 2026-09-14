import { useEffect } from 'react'
import './Blog.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Blog() {
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [blogRef, blogVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);

  return (
    <div className="blog-page">
      <header className="blog-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>
            Our Blog
          </p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>
            Before We Led, We Learned Together
          </h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            Read about our latest activities and thoughts.
          </p>
        </div>
      </header>

      <main>
        <section className="blog-content-section" ref={blogRef}>
          <div className={`container blog-iframe-container ${getAnimationClass('fadeInUp', blogVisible)}`}>
            <iframe 
              src="https://blog01-leosofuop.blogspot.com/2026/08/before-we-led-we-learned-together-o-n.html" 
              title="Blog Post"
              className="blog-iframe"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Blog
