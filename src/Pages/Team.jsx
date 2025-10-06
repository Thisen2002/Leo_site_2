import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import './Team.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'
import executiveBoard from '../json files/executiveBoard.json'
import avenuedirectors from '../json files/avenuedirectors.json'

function Team() {
  const { teamType } = useParams()
  const location = useLocation()
  
  // Determine which team to show based on URL
  const getTeamType = () => {
    if (teamType === 'executive') return 'executive'
    if (teamType === 'avenue-directors') return 'avenue-directors'
    // Default to executive if no specific type or just /team
    return 'executive'
  }
  
  const currentTeamType = getTeamType()
  
  // Animation hooks
  const [headerRef, headerVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [leadershipRef, leadershipVisible] = useStaggerAnimation(2, 200);
  const [executiveRef, executiveVisible] = useStaggerAnimation(executiveBoard.filter(m => !['President', 'Past President'].includes(m.position)).length, 100);
  const [avenueRef, avenueVisible] = useStaggerAnimation(avenuedirectors.length, 100);
  
  // Render Executive Board
  const renderExecutiveBoard = () => (
    <section className="executive-section" ref={headerRef}>
      <div className="container">
        <div className={`section-header ${getAnimationClass('fadeInUp', headerVisible)}`}>
          <h2 className={getAnimationClass('slideInUp', headerVisible)}>Executive Board</h2>
          <p className={`${getAnimationClass('fadeInUp', headerVisible)} animate-delay-200`}>Our leadership team committed to serving with excellence and integrity.</p>
        </div>
        
        {/* Leadership Row - President and Past President */}
        <div className="leadership-section" ref={leadershipRef}>
          <div className="team-grid leadership-grid">
            {executiveBoard
              .filter(member => member.position === 'President' || member.position === 'Past President')
              .map((member, index) => (
                <div key={member.id} className={`member-card executive-card leadership-card team-member-animation ${leadershipVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                    <div className="member-overlay">
                      <div className="member-social">
                        <a href={`mailto:${member.email}`} className="social-link email-link">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </a>
                        <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="member-content">
                    <h3>{member.name}</h3>
                    <p className="position">{member.position}</p>
                    <p className="bio">{member.bio}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Other Executive Members - 3 per row */}
        <div className="other-members-section" ref={executiveRef}>
          <div className="team-grid executive-grid three-column">
            {executiveBoard
              .filter(member => member.position !== 'President' && member.position !== 'Past President')
              .map((member, index) => (
                <div key={member.id} className={`member-card executive-card team-member-animation ${executiveVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                    <div className="member-overlay">
                      <div className="member-social">
                        <a href={`mailto:${member.email}`} className="social-link email-link">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </a>
                        <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="member-content">
                    <h3>{member.name}</h3>
                    <p className="position">{member.position}</p>
                    <p className="bio">{member.bio}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
  
  // Render Avenue Directors
  const renderAvenueDirectors = () => {
    // Flatten all members from all avenues into a single array with avenue info
    const allMembers = avenuedirectors.reduce((acc, avenue) => {
      const membersWithAvenue = avenue.members.map(member => ({
        ...member,
        avenue: avenue.avenue
      }));
      return acc.concat(membersWithAvenue);
    }, []);

    return (
      
      
      <section className="avenue-directors-section" ref={headerRef}>
        <div className="container">
          <div className="section-header">
            <h2>Avenue Directors</h2>
            <p>Dedicated leaders driving positive change across different avenues of service.</p>
          </div>
          
          <div className="team-grid avenue-grid-flat" ref={avenueRef}>
            {allMembers.map((member, memberIndex) => (
              <div key={memberIndex} className={`member-card avenue-card team-member-animation ${avenueVisible.has(memberIndex) ? 'animate-visible' : 'animate-hidden'}`}>
                <div className="member-image">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x120/1e3c72/ffffff?text=' + member.name.split(' ').map(n => n[0]).join('')
                    }}
                  />
                  <div className="member-overlay">
                    <div className="member-social">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="social-link email-link">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </a>
                      )}
                      <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="member-content">
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <p className="avenue">{member.avenue}</p>
                  {member.bio && <p className="bio">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="team-page">
      <header className="team-hero">
        <div className="container">
          <p className="eyebrow">Meet Our Team</p>
          <h1>Leadership & Excellence</h1>
          <p className="subtitle">
            Meet the dedicated individuals who drive our mission forward and make 
            a positive impact in our community every day.
          </p>
        </div>
      </header>

      <main>
        {currentTeamType === 'executive' ? renderExecutiveBoard() : renderAvenueDirectors()}
      </main>
    </div>
  )
}

export default Team
