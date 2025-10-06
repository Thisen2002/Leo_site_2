import { useEffect } from 'react'
import './About.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation, 
  useCounterAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function About() {
  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [storyRef, storyVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  const [valuesRef, valuesVisible] = useStaggerAnimation(3, 200);
  const [internationalRef, internationalVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  
  // Counter animations for stats
  const [statsRef1, count1] = useCounterAnimation(150, 2000);
  const [statsRef2, count2] = useCounterAnimation(50, 2000);
  const [statsRef3, count3] = useCounterAnimation(10000, 2500);

  return (
    <div className="about-page">
      <header className="about-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>
            About Us
          </p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>
            Leadership. Experience. Opportunity.
          </h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            The Leo Society of the University of Peradeniya is a student-led community of young leaders
            dedicated to service, personal growth, and positive impact—on campus and beyond.
          </p>
        </div>
      </header>

      <main>
        {/* Our Story */}
        <section className="story-section" ref={storyRef}>
          <div className="container story-grid">
            <div className={`story-text ${getAnimationClass('slideInLeft', storyVisible)}`}>
              <h2 className={getAnimationClass('fadeInUp', storyVisible)}>Our Story</h2>
              <p className={`${getAnimationClass('fadeInUp', storyVisible)} animate-delay-200`}>
                We are part of the global Leo movement young people creating meaningful change through
                volunteerism and leadership development. At Peradeniya, our projects span education,
                environment, health, and community development, giving members hands-on experience to lead,
                collaborate, and serve.
              </p>
              <ul className={`highlights ${getAnimationClass('fadeInUp', storyVisible)} animate-delay-400`}>
                <li>Community service projects with real impact</li>
                <li>Leadership and soft-skill development</li>
                <li>Networking across universities and districts</li>
                <li>Memories, friendships, and purpose-driven fun</li>
              </ul>
            </div>

            <div className={`impact-card ${getAnimationClass('slideInRight', storyVisible)} animate-delay-300`}>
              <h3 className={getAnimationClass('fadeInUp', storyVisible)}>At a Glance</h3>
              <div className="impact-stats">
                <div className={`impact-item ${getAnimationClass('scaleIn', count1 > 0)}`} ref={statsRef1}>
                  <span className="number stats-counter">{count1}+</span>
                  <span className="label">Active Members</span>
                </div>
                <div className={`impact-item ${getAnimationClass('scaleIn', count2 > 0)} animate-delay-200`} ref={statsRef2}>
                  <span className="number stats-counter">{count2}+</span>
                  <span className="label">Projects / Year</span>
                </div>
                <div className={`impact-item ${getAnimationClass('scaleIn', count3 > 0)} animate-delay-400`} ref={statsRef3}>
                  <span className="number stats-counter">{count3 > 1000 ? `${Math.floor(count3/1000)}k` : count3}+</span>
                  <span className="label">Lives Reached</span>
                </div>
              </div>
              <p className={`mini-note ${getAnimationClass('fadeInUp', storyVisible)} animate-delay-600`}>
                Numbers are indicative — update with your latest stats.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section" ref={valuesRef}>
          <div className="container">
            <h2 className={getAnimationClass('slideInUp', valuesVisible.size > 0)}>
              What We Stand For
            </h2>
            <div className="values-grid">
              <div className={`value-card card-animation ${valuesVisible.has(0) ? 'animate-visible' : 'animate-hidden'}`}>
                <div className="icon">🦁</div>
                <h3>Leadership</h3>
                <p>We empower students to lead with empathy, initiative, and integrity.</p>
              </div>
              <div className={`value-card card-animation ${valuesVisible.has(1) ? 'animate-visible' : 'animate-hidden'}`}>
                <div className="icon">✨</div>
                <h3>Experience</h3>
                <p>Hands-on service and projects that build real-world skills.</p>
              </div>
              <div className={`value-card card-animation ${valuesVisible.has(2) ? 'animate-visible' : 'animate-hidden'}`}>
                <div className="icon">🚀</div>
                <h3>Opportunity</h3>
                <p>Grow your network, explore roles, and make a difference together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leo International Connection */}
        <section className="leo-international-section" ref={internationalRef}>
          <div className="container">
            <div className="international-grid">
              <div className={`international-content ${getAnimationClass('slideInLeft', internationalVisible)}`}>
                <h2 className={getAnimationClass('fadeInUp', internationalVisible)}>
                  Part of Something Bigger
                </h2>
                <p className={`${getAnimationClass('fadeInUp', internationalVisible)} animate-delay-200`}>
                  As a Leo Club, we're part of Leo Clubs International, associated with Lions Clubs International - 
                  the world's largest service club organization. This connection gives our members access to:
                </p>
                <ul className={`benefits-list ${getAnimationClass('fadeInUp', internationalVisible)} animate-delay-400`}>
                  <li>Global network of young leaders</li>
                  <li>International service opportunities</li>
                  <li>Leadership development programs</li>
                  <li>District and multiple district conventions</li>
                  <li>Recognition and awards programs</li>
                </ul>
              </div>
              <div className="international-stats">
                <div className="stat-box">
                  <h3>7,000+</h3>
                  <p>Leo Clubs Worldwide</p>
                </div>
                <div className="stat-box">
                  <h3>170,000+</h3>
                  <p>Leo Members Globally</p>
                </div>
                <div className="stat-box">
                  <h3>200+</h3>
                  <p>Countries & Territories</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="why-join-section">
          <div className="container">
            <h2>Why Join Leo club of University of Peradeniya?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                {/* <div className="benefit-icon">🎯</div> */}
                <h3>Skill Development</h3>
                <p>Develop leadership, communication, project management, and teamwork skills through real-world service projects.</p>
              </div>
              <div className="benefit-card">
                {/* <div className="benefit-icon">🤝</div> */}
                <h3>Networking</h3>
                <p>Connect with like-minded students, alumni, and professionals who share your passion for service and leadership.</p>
              </div>
              <div className="benefit-card">
                {/* <div className="benefit-icon">🌱</div> */}
                <h3>Personal Growth</h3>
                <p>Challenge yourself, step out of your comfort zone, and discover your potential while making a positive impact.</p>
              </div>
              <div className="benefit-card">
                {/* <div className="benefit-icon">🏆</div> */}
                <h3>Recognition</h3>
                <p>Gain recognition for your service through awards, certificates, and leadership positions within the organization.</p>
              </div>
              <div className="benefit-card">
                {/* <div className="benefit-icon">🌍</div> */}
                <h3>Global Perspective</h3>
                <p>Participate in international service projects and connect with Leo clubs around the world.</p>
              </div>
              <div className="benefit-card">
                {/* <div className="benefit-icon">📚</div> */}
                <h3>Academic Balance</h3>
                <p>Learn to balance academics with meaningful extracurricular activities that enhance your university experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Section */}
        <section className="impact-section">
          <div className="container">
            <h2>Our Community Impact</h2>
            <div className="impact-areas">
              <div className="impact-area">
                <div className="impact-visual">📚</div>
                <h3>Education</h3>
                <p>Supporting underprivileged students with scholarships, school supplies, and tutoring programs.</p>
              </div>
              <div className="impact-area">
                <div className="impact-visual">🌿</div>
                <h3>Environment</h3>
                <p>Leading tree planting drives, clean-up campaigns, and environmental awareness programs.</p>
              </div>
              <div className="impact-area">
                <div className="impact-visual">🏥</div>
                <h3>Health</h3>
                <p>Organizing health camps, blood donation drives, and health awareness campaigns.</p>
              </div>
              <div className="impact-area">
                <div className="impact-visual">🏠</div>
                <h3>Community Development</h3>
                <p>Supporting infrastructure projects, housing initiatives, and community facility improvements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <div className="container">
            <h2>Milestones</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="dot" />
                <div className="content">
                  <h4>Year</h4>
                  <p>Club established at the University of Peradeniya.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="dot" />
                <div className="content">
                  <h4>Year</h4>
                  <p>First large-scale community project launched.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="dot" />
                <div className="content">
                  <h4>Year</h4>
                  <p>Recognition at district/MD level for service excellence.</p>
                </div>
              </div>
            </div>
            <p className="section-note">Fill in accurate years and achievements.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="container">
            <h2>Join the Pride</h2>
            <p>Ready to build skills, serve the community, and meet inspiring people?</p>
            <div className="cta-actions">
              <a className="primary-btn" href="/contact">Become a Member</a>
              <a className="secondary-btn" href="/projects">Explore Our Projects</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default About