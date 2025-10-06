import React, { useState, useEffect } from 'react'
import './Homepage.css' // Make sure to create this CSS file
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation, 
  useCounterAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

// Import hero section images
import img1 from '/Pic/hero_section/IMG-1.jpg'
import img2 from '/Pic/hero_section/IMG-2.jpg'
import img3 from '/Pic/hero_section/IMG-3.jpg'
import img4 from '/Pic/hero_section/IMG-4.jpg'

function Homepage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [img1, img2, img3, img4];

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [aboutRef, aboutVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  const [missionRef, missionVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  const [activitiesRef, activitiesVisible] = useStaggerAnimation(4, 150);
  
  // Counter animations for stats
  const [statsRef1, count1] = useCounterAnimation(200, 2000);
  const [statsRef2, count2] = useCounterAnimation(50, 2000);
  const [statsRef3, count3] = useCounterAnimation(10000, 2500);
  const [statsRef4, count4] = useCounterAnimation(3, 1500);
  
  const [ctaRef, ctaVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div 
          className="hero-background"
          style={{
            backgroundImage: `url(${heroImages[currentImageIndex]})`, 
          }}
        />
        <div className="hero-overlay"></div>
        <div className={`hero-content ${getAnimationClass('fadeInUp', heroVisible)}`}>
          <img 
            src="/Leo_UoP.png" 
            alt="Leo Society Logo" 
            className={`logo ${getAnimationClass('scaleIn', heroVisible)} animate-delay-200`}
          />
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-400`}>
            Leo club
          </h1>
          <h2 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-600`}>
            University of Peradeniya
          </h2>
          <p className={`tagline ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-800`}>
            We Serve with Pride
          </p>
          <button 
            className={`cta-button ${getAnimationClass('scaleIn', heroVisible)} animate-delay-1000`}
            onClick={() => window.open('https://forms.gle/VZokFgZajSyLVbyd8', '_blank')}
          >
            Join Our Mission
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" ref={aboutRef}>
        <div className="container">
          <h2 className={getAnimationClass('slideInLeft', aboutVisible)}>
            Who We Are
          </h2>
          <p className={`${getAnimationClass('fadeInUp', aboutVisible)} animate-delay-200`}>
            The Leo Society of University of Peradeniya is a vibrant community of young leaders 
            dedicated to serving our university and the broader community. As part of Leo Clubs 
            International, we embody the spirit of Leadership, Experience, and Opportunity.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision" ref={missionRef}>
        <div className="container">
          <div className="mv-grid">
            <div className={`mission ${getAnimationClass('slideInLeft', missionVisible)}`}>
              <h3 className={getAnimationClass('fadeInUp', missionVisible)}>Our Mission</h3>
              <p className={`${getAnimationClass('fadeInUp', missionVisible)} animate-delay-200`}>
                To provide the youth of the world with an opportunity for development and 
                contribution, individually and collectively, as responsible members of the 
                local, national and international community.
              </p>
            </div>
            <div className={`vision ${getAnimationClass('slideInRight', missionVisible)} animate-delay-300`}>
              <h3 className={`${getAnimationClass('fadeInUp', missionVisible)} animate-delay-400`}>Our Vision</h3>
              <p className={`${getAnimationClass('fadeInUp', missionVisible)} animate-delay-500`}>
                To be the global leader in community and humanitarian service, empowering 
                volunteers to serve their communities, meet humanitarian needs, encourage 
                peace and promote international understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities-section" ref={activitiesRef}>
        <div className="container">
          <h2 className={getAnimationClass('slideInUp', activitiesVisible.size > 0)}>
            What We Do
          </h2>
          <div className="activities-grid">
            <div className={`activity-card card-animation ${activitiesVisible.has(0) ? 'animate-visible' : 'animate-hidden'}`}>
              <div className="icon">🎓</div>
              <h3>Education</h3>
              <p>Supporting education initiatives and scholarship programs for underprivileged students</p>
            </div>
            <div className={`activity-card card-animation ${activitiesVisible.has(1) ? 'animate-visible' : 'animate-hidden'}`}>
              <div className="icon">🌱</div>
              <h3>Environment</h3>
              <p>Organizing tree planting campaigns and environmental conservation projects</p>
            </div>
            <div className={`activity-card card-animation ${activitiesVisible.has(2) ? 'animate-visible' : 'animate-hidden'}`}>
              <div className="icon">❤️</div>
              <h3>Community Service</h3>
              <p>Conducting blood donation camps, health clinics, and community development programs</p>
            </div>
            <div className={`activity-card card-animation ${activitiesVisible.has(3) ? 'animate-visible' : 'animate-hidden'}`}>
              <div className="icon">🤝</div>
              <h3>Leadership</h3>
              <p>Developing leadership skills through workshops, seminars, and hands-on projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className={`stat ${getAnimationClass('scaleIn', count1 > 0)}`} ref={statsRef1}>
              <h3 className="stats-counter">{count1}+</h3>
              <p>Active Members</p>
            </div>
            <div className={`stat ${getAnimationClass('scaleIn', count2 > 0)} animate-delay-200`} ref={statsRef2}>
              <h3 className="stats-counter">{count2}+</h3>
              <p>Projects Completed</p>
            </div>
            <div className={`stat ${getAnimationClass('scaleIn', count3 > 0)} animate-delay-400`} ref={statsRef3}>
              <h3 className="stats-counter">{count3.toLocaleString()}+</h3>
              <p>Lives Impacted</p>
            </div>
            <div className={`stat ${getAnimationClass('scaleIn', count4 > 0)} animate-delay-600`} ref={statsRef4}>
              <h3 className="stats-counter">{count4}+</h3>
              <p>Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" ref={ctaRef}>
        <div className="container">
          <h2 className={getAnimationClass('slideInUp', ctaVisible)}>
            Ready to Make a Difference?
          </h2>
          <p className={`${getAnimationClass('fadeInUp', ctaVisible)} animate-delay-200`}>
            Join us in our mission to serve the community and develop leadership skills
          </p>
          <div className="cta-buttons">
            <button className={`primary-button button-animation ${ctaVisible ? 'animate-visible' : 'animate-hidden'} animate-delay-400`}>
              Become a Member
            </button>
            <button className={`secondary-button button-animation ${ctaVisible ? 'animate-visible' : 'animate-hidden'} animate-delay-600`}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}

export default Homepage