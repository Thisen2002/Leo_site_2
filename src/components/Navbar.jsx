import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    // Scroll to top when navigating to a new page
    window.scrollTo(0, 0)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleTeamDropdown = () => {
    setIsTeamDropdownOpen(!isTeamDropdownOpen)
  }

  const closeTeamDropdown = () => {
    setIsTeamDropdownOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <img src="/Leo_UoP.png" alt="Leo Logo" className="nav-logo" />
          <span className="nav-title">Leo club of University of Peradeniya</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>About</Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`} onClick={closeMenu}>Projects</Link>
          {/* <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`} onClick={closeMenu}>Events</Link> */}
          
          {/* Team Dropdown */}
          <div className="nav-dropdown" onMouseLeave={closeTeamDropdown}>
            <button 
              className={`nav-link dropdown-toggle ${isActive('/team') || isActive('/team/executive') || isActive('/team/avenue-directors') ? 'active' : ''}`} 
              onMouseEnter={toggleTeamDropdown}
              onClick={toggleTeamDropdown}
            >
              Team
              <span className="dropdown-arrow">▼</span>
            </button>
            {isTeamDropdownOpen && (
              <div className="dropdown-menu">
                <Link 
                  to="/team/executive" 
                  className="dropdown-item" 
                  onClick={() => { closeMenu(); closeTeamDropdown(); window.scrollTo(0, 0); }}
                >
                  Executive Board
                </Link>
                <Link 
                  to="/team/avenue-directors" 
                  className="dropdown-item" 
                  onClick={() => { closeMenu(); closeTeamDropdown(); window.scrollTo(0, 0); }}
                >
                  Avenue Directors
                </Link>
              </div>
            )}
          </div>
          
          <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`} onClick={closeMenu}>Gallery</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeMenu}>Contact</Link>
          <button className="nav-cta-button" onClick={() => window.open('https://forms.gle/VZokFgZajSyLVbyd8', '_blank')}>
  Join Us
</button>
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'bar1' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar2' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar3' : ''}`}></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar