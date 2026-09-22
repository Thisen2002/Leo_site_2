import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import './Team.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Team() {
  const { teamType } = useParams()
  const location = useLocation()
  
  const [executiveBoard, setExecutiveBoard] = useState([])
  const [avenueDirectors, setAvenueDirectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [termFilter, setTermFilter] = useState('26/27') // Default to newest term

  // Determine which team to show based on URL
  const getTeamType = () => {
    if (teamType === 'executive') return 'executive'
    if (teamType === 'avenue-directors') return 'avenue-directors'
    return 'executive'
  }
  
  const currentTeamType = getTeamType()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      const [excoRes, bodRes] = await Promise.all([
        supabase.from('executive_board').select('*').order('id', { ascending: true }),
        supabase.from('avenue_directors').select('*').order('id', { ascending: true })
      ])

      if (!excoRes.error) setExecutiveBoard(excoRes.data || [])
      if (!bodRes.error) setAvenueDirectors(bodRes.data || [])
      
      setLoading(false)
    }

    fetchData()
  }, [])
  
  const allTerms = [...executiveBoard.map(m => m.term), ...avenueDirectors.map(m => m.term)]
  const availableTerms = [...new Set(allTerms.map(t => t || '25/26'))].sort().reverse()
  if (availableTerms.length === 0) availableTerms.push('26/27', '25/26')
  if (!availableTerms.includes('26/27')) availableTerms.unshift('26/27')

  const filteredExecutiveBoard = executiveBoard.filter(member => (member.term || '25/26') === termFilter)
  const filteredAvenueDirectors = avenueDirectors.filter(member => (member.term || '25/26') === termFilter)

  // Animation hooks
  const [headerRef, headerVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [leadershipRef, leadershipVisible] = useStaggerAnimation(2, 200);
  
  const otherExecutivesCount = filteredExecutiveBoard.filter(m => !['President', 'Past President'].includes(m.position)).length;
  const [executiveRef, executiveVisible] = useStaggerAnimation(otherExecutivesCount || 1, 100);
  
  const totalAvenueMembers = filteredAvenueDirectors.length;
  
  // Use shorter delay for mobile devices to improve performance
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const staggerDelay = isSmallMobile ? 25 : isMobile ? 50 : 100;
  const [avenueRef, avenueVisible] = useStaggerAnimation(totalAvenueMembers || 1, staggerDelay);

  // Fallback mechanism for mobile devices
  const [showAvenueFallback, setShowAvenueFallback] = useState(false);
  useEffect(() => {
    if (totalAvenueMembers === 0) return;
    const timer = setTimeout(() => {
      if (avenueVisible.size < totalAvenueMembers) {
        setShowAvenueFallback(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [totalAvenueMembers, avenueVisible.size]);

  const handleTermFilter = (e) => {
    setTermFilter(e.target.value)
    setShowAvenueFallback(false)
  }

  const getImageUrl = (bucket, path) => {
    if (!path) return '';
    if (path.startsWith('/Pic/')) return path;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  
  // Render Executive Board
  const renderExecutiveBoard = () => (
    <section className="executive-section" ref={headerRef}>
      <div className="container">
        <div className="section-header">
          <h2>Executive Board</h2>
          <p>Our leadership team committed to serving with excellence and integrity.</p>
        </div>
        
        {filteredExecutiveBoard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No executive board members found for the {termFilter} term.
          </div>
        ) : (
          <>
            {/* Leadership Row - President and Past President */}
            <div className="leadership-section">
              <div className="team-grid leadership-grid">
                {filteredExecutiveBoard
                  .filter(member => member.position === 'President' || member.position === 'Past President')
                  .map((member, index) => (
                    <div key={member.id} className="member-card executive-card leadership-card">
                      <div className="member-image">
                        <img 
                          src={getImageUrl('exco-images', member.image_url)} 
                          alt={member.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/1e3c72/ffffff?text=' + member.name.charAt(0) }} 
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
                            {member.linkedin && (
                              <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </a>
                            )}
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
            <div className="other-members-section">
              <div className="team-grid executive-grid three-column">
                {filteredExecutiveBoard
                  .filter(member => member.position !== 'President' && member.position !== 'Past President')
                  .map((member, index) => (
                    <div key={member.id} className="member-card executive-card">
                      <div className="member-image">
                        <img 
                          src={getImageUrl('exco-images', member.image_url)} 
                          alt={member.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/1e3c72/ffffff?text=' + member.name.charAt(0) }} 
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
                            {member.linkedin && (
                              <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="member-content">
                        <h3>{member.name}</h3>
                        <p className="position">{member.position}</p>
                        {member.bio && <p className="bio">{member.bio}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
  
  // Render Avenue Directors
  const renderAvenueDirectors = () => {
    return (
      <section className="avenue-directors-section">
        <div className="container">
          <div className="section-header">
            <h2>Avenue Directors</h2>
            <p>Dedicated leaders driving positive change across different avenues of service.</p>
          </div>
          
          {filteredAvenueDirectors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No avenue directors found for the {termFilter} term.
            </div>
          ) : (
            <div className="team-grid avenue-grid-flat">
              {filteredAvenueDirectors.map((member, memberIndex) => (
                <div key={member.id} className="member-card avenue-card">
                  <div className="member-image">
                    <img 
                      src={getImageUrl('bod-images', member.image_url)} 
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/1e3c72/ffffff?text=' + member.name.charAt(0)
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
                        {member.linkedin && (
                          <a href={member.linkedin} className="social-link linkedin-link" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="member-content">
                    <h3>{member.name}</h3>
                    <p className="position">{member.position}</p>
                    <p className="avenue">{member.avenue}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading team data...</div>
  }

  return (
    <div className="team-page">
      <header className="team-hero">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <p className="eyebrow">Meet Our Team</p>
              <h1>Leadership & Excellence</h1>
              <p className="subtitle">
                Meet the dedicated individuals who drive our mission forward and make 
                a positive impact in our community every day.
              </p>
            </div>
            <div className="term-selector" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Leastic Term:</label>
              <select 
                value={termFilter}
                onChange={handleTermFilter}
                style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '500', cursor: 'pointer', outline: 'none', backdropFilter: 'blur(10px)' }}
              >
                {availableTerms.map(term => (
                  <option key={term} value={term} style={{ color: 'black' }}>{term}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main>
        {currentTeamType === 'executive' ? renderExecutiveBoard() : renderAvenueDirectors()}
      </main>
    </div>
  )
}

export default Team
