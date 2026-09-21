import React, { useState, useEffect } from 'react'
import './Projects.css'
import '../utils/scrollAnimations.css'
import { supabase } from '../utils/supabase'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  // Get unique status values and add 'All' option
  const statusOptions = ['All', ...new Set(projects.map(project => project.status))]

  // Filter projects based on selected status
  const filteredProjects = statusFilter === 'All' 
    ? projects 
    : projects.filter(project => project.status === statusFilter)
  
  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [filterRef, filterVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  
  // Progressive delay reduction for mobile performance
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const staggerDelay = isSmallMobile ? 25 : isMobile ? 50 : 100;
  const [projectsRef, projectsVisible] = useStaggerAnimation(filteredProjects.length || 1, staggerDelay);
  
  // Fallback mechanism for mobile devices
  const [showFallback, setShowFallback] = useState(false);
  useEffect(() => {
    if (filteredProjects.length === 0) return;
    const timer = setTimeout(() => {
      if (projectsVisible.size < filteredProjects.length) {
        setShowFallback(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [filteredProjects.length, projectsVisible.size]);
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed'
      case 'Ongoing': return 'status-ongoing'
      case 'Upcoming': return 'status-upcoming'
      case '26/27 Term': return 'status-new-term'
      default: return 'status-default'
    }
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    // Reset fallback when filter changes
    setShowFallback(false)
  }

  // Helper to render image from Supabase
  const getImageUrl = (path) => {
    if (!path) return ''
    return supabase.storage.from('project-images').getPublicUrl(path).data.publicUrl
  }

  return (
    <div className="projects-page">
      <header className="projects-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>Our Impact</p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>Projects & Initiatives</h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            Discover how we're making a difference in our community through meaningful projects 
            that create lasting positive change.
          </p>
        </div>
      </header>

      <main>
        <section className="projects-grid-section">
          {loading ? (
            <div className="container" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              Loading projects...
            </div>
          ) : (
            <>
              <div className="container" ref={filterRef}>
                <div className={`filter-controls ${getAnimationClass('slideInUp', filterVisible)}`}>
                  <div className="filter-buttons">
                    {statusOptions.map((status, index) => (
                      <button
                        key={status}
                        className={`filter-btn ${statusFilter === status ? 'active' : ''} button-animation ${filterVisible ? 'animate-visible' : 'animate-hidden'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onClick={() => handleStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="container" ref={projectsRef}>
                <div className="projects-grid">
                  {filteredProjects.map((project, index) => (
                    <div key={project.id} className={`project-card project-card-animation ${projectsVisible.has(index) || showFallback ? 'animate-visible' : 'animate-hidden'}`}>
                      <div className="project-image">
                        <img src={getImageUrl(project.image_url)} alt={project.title} />
                        <div className={`status-badge ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </div>
                      </div>
                      <div className="project-content">
                        <span className="project-category">{project.category}</span>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-footer">
                          <span className="impact">{project.impact}</span>
                          <button className="learn-more-btn">Learn More</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default Projects
