import React, { useState } from 'react'
import './Contact.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  useStaggerAnimation,
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [contactRef, contactVisible] = useStaggerAnimation(3, 200);
  const [formRef, formVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      title: 'Email',
      details: 'contact@leosocietyuop.org',
    },
    {
      title: 'Phone',
      details: '+94 81 238 9999',
    },
    {
      title: 'Address',
      details: 'University of Peradeniya',
    }
  ]

  return (
    <div className="contact-page">
      {/* Header Section */}
      <section className="contact-header" ref={heroRef}>
        <div className="container">
          <h1 className={getAnimationClass('slideInUp', heroVisible)}>Contact Us</h1>
          <p className={`${getAnimationClass('fadeInUp', heroVisible)} animate-delay-200`}>Get in touch with the Leo Society of University of Peradeniya</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className={`contact-form-section ${getAnimationClass('slideInLeft', formVisible)}`} ref={formRef}>
              <h2 className={getAnimationClass('fadeInUp', formVisible)}>Send us a Message</h2>
              
              <form className={`contact-form ${getAnimationClass('fadeInUp', formVisible)} animate-delay-200`} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="partnership">Partnership/Collaboration</option>
                    <option value="events">Event Information</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className={`contact-info-section ${getAnimationClass('slideInRight', formVisible)} animate-delay-400`}>
              <h2 className={getAnimationClass('fadeInUp', formVisible)}>Contact Information</h2>
              
              <div className="contact-info-list" ref={contactRef}>
                {contactInfo.map((info, index) => (
                  <div key={index} className={`contact-info-item card-animation ${contactVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}>
                    <h3>{info.title}</h3>
                    <p className="contact-detail">{info.details}</p>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="social-media-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="https://facebook.com/leosocietyuop" target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                  <a href="https://instagram.com/leosocietyuop" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                  <a href="https://linkedin.com/company/leosocietyuop" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
