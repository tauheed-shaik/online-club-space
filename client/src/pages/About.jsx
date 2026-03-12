
import React from 'react'
import '../styles/General.css'

const About = () => {
  return (
    <section className="section__container">
      <span className="section__subtitle">About Us</span>
      <h2 className="section__title">Connecting People Through Shared Experiences</h2>
      
      <div className="about__content">
        <div className="about__img">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About Online Club Space" />
        </div>
        <div className="about__text">
          <p>
            Welcome to Online Club Space, the ultimate platform for discovering and booking exclusive events. 
            Whether you're looking for vibrant social gatherings, professional workshops, or niche club meetings, 
            we bring the community together in one seamless digital space.
          </p>
          <p>
            Our mission is simple: to make every event an unforgettable experience. We provide tools for 
            organizers to reach their audience and for attendees to find their next great adventure.
          </p>
          <div className="experience__wrapper d-flex align-items-center gap-5">
            <div className="counter__item">
              <span>12k+</span>
              <h6>Successful Events</h6>
            </div>
            <div className="counter__item">
              <span>2k+</span>
              <h6>Regular Clients</h6>
            </div>
            <div className="counter__item">
              <span>15</span>
              <h6>Years Experience</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About