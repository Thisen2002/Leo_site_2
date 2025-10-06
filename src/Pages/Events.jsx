import React, { useEffect, useState } from 'react'
import './Events.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Events() {
  useEffect(() => {
    document.title = 'Events | Leo club of University of Peradeniya'
  }, [])

  const [activeTab, setActiveTab] = useState('upcoming')
  
  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [tabsRef, tabsVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  const [eventsRef, eventsVisible] = useStaggerAnimation(6, 100);

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Leo Convention 2025",
      date: "2025-04-15",
      time: "9:00 AM - 6:00 PM",
      location: "Main Auditorium, University of Peradeniya",
      category: "Convention",
      description: "Join us for our biggest event of the year featuring keynote speakers, workshops, and networking opportunities.",
      image: "/event-convention.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Community Clean-up Drive",
      date: "2025-03-20",
      time: "7:00 AM - 12:00 PM",
      location: "Kandy City Center",
      category: "Service",
      description: "Help us make our city cleaner and greener. All volunteers welcome!",
      image: "/event-cleanup.jpg"
    },
    {
      id: 3,
      title: "Leadership Workshop Series",
      date: "2025-03-25",
      time: "2:00 PM - 5:00 PM",
      location: "Leo Club Room, UOP",
      category: "Workshop",
      description: "Enhance your leadership skills with expert facilitators and interactive sessions.",
      image: "/event-workshop.jpg"
    }
  ]

  const pastEvents = [
    {
      id: 4,
      title: "Christmas Charity Drive 2024",
      date: "2024-12-20",
      time: "10:00 AM - 4:00 PM",
      location: "Various Locations",
      category: "Charity",
      description: "Successfully distributed gifts and essential items to 200+ families in need.",
      image: "/event-charity.jpg",
      impact: "200+ families helped"
    },
    {
      id: 5,
      title: "Fresher's Welcome 2024",
      date: "2024-11-15",
      time: "6:00 PM - 10:00 PM",
      location: "University Grounds",
      category: "Social",
      description: "Welcomed new members with cultural performances and fellowship activities.",
      image: "/event-welcome.jpg",
      impact: "50+ new members"
    },
    {
      id: 6,
      title: "Environmental Awareness Campaign",
      date: "2024-10-05",
      time: "8:00 AM - 2:00 PM",
      location: "Botanical Gardens, Peradeniya",
      category: "Environment",
      description: "Raised awareness about environmental conservation through educational activities.",
      image: "/event-environment.jpg",
      impact: "500+ people reached"
    }
  ]

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Convention': '#8b5cf6',
      'Service': '#10b981',
      'Workshop': '#f59e0b',
      'Charity': '#ef4444',
      'Social': '#3b82f6',
      'Environment': '#059669'
    }
    return colors[category] || '#6b7280'
  }

  return (
    <div className="events-page">
      <header className="events-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>Get Involved</p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>Events & Activities</h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            Join us in our upcoming events and discover how you can make a difference 
            in your community while building lasting friendships.
          </p>
        </div>
      </header>

      <main>
        <section className="events-content">
          <div className="container">
            <div className={`events-tabs ${getAnimationClass('slideInUp', tabsVisible)}`} ref={tabsRef}>
              <button 
                className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''} button-animation ${tabsVisible ? 'animate-visible' : 'animate-hidden'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Events
              </button>
              <button 
                className={`tab-button ${activeTab === 'past' ? 'active' : ''} button-animation ${tabsVisible ? 'animate-visible' : 'animate-hidden'} animate-delay-200`}
                onClick={() => setActiveTab('past')}
              >
                Past Events
              </button>
            </div>

            {activeTab === 'upcoming' && (
              <div className="events-grid" ref={eventsRef}>
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className={`event-card ${event.featured ? 'featured' : ''} card-animation ${eventsVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      <div 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      >
                        {event.category}
                      </div>
                      {event.featured && <div className="featured-badge">Featured</div>}
                    </div>
                    <div className="event-content">
                      <div className="event-date">
                        <span className="date">{formatDate(event.date)}</span>
                        <span className="time">{event.time}</span>
                      </div>
                      <h3>{event.title}</h3>
                      <p className="location">📍 {event.location}</p>
                      <p className="description">{event.description}</p>
                      <div className="event-actions">
                        <button className="btn-register">Register Now</button>
                        <button className="btn-learn-more">Learn More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="events-grid">
                {pastEvents.map((event, index) => (
                  <div key={event.id} className={`event-card past-event card-animation ${eventsVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      <div 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      >
                        {event.category}
                      </div>
                    </div>
                    <div className="event-content">
                      <div className="event-date">
                        <span className="date">{formatDate(event.date)}</span>
                        <span className="time">{event.time}</span>
                      </div>
                      <h3>{event.title}</h3>
                      <p className="location">📍 {event.location}</p>
                      <p className="description">{event.description}</p>
                      {event.impact && (
                        <div className="impact-badge">
                          Impact: {event.impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="join-events-section">
          <div className="container">
            <div className="join-content">
              <h2>Stay Updated on Our Events</h2>
              <p>
                Never miss an opportunity to make a difference. Subscribe to our newsletter 
                to get notified about upcoming events and activities.
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email address" />
                <button className="subscribe-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Events
