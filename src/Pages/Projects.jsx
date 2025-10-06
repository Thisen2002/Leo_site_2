import React, { useState } from 'react'
import './Projects.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'
import projects from '../json files/Projects.json'

function Projects() {
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [filterRef, filterVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  const [projectsRef, projectsVisible] = useStaggerAnimation(projects.length, 100);
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed'
      case 'Ongoing': return 'status-ongoing'
      case 'Upcoming': return 'status-upcoming'
      default: return 'status-default'
    }
  }

  // Get unique status values and add 'All' option
  const statusOptions = ['All', ...new Set(projects.map(project => project.status))]

  // Filter projects based on selected status
  const filteredProjects = statusFilter === 'All' 
    ? projects 
    : projects.filter(project => project.status === statusFilter)

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
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
                <div key={project.id} className={`project-card project-card-animation ${projectsVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
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
        </section>

        {/* <section className="get-involved-section">
          <div className="container">
            <div className="get-involved-content">
              <h2>Want to Get Involved?</h2>
              <p>
                Join us in creating positive change in our community. Whether you want to volunteer 
                for existing projects or propose new initiatives, we welcome your participation.
              </p>
              <div className="cta-buttons">
                <button className="btn-primary">Join a Project</button>
                <button className="btn-secondary">Propose an Idea</button>
              </div>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  )
}

export default Projects
