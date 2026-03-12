
import React from 'react'
import '../styles/General.css'

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Michael Chen',
    role: 'Head of Events',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Manager',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'David Wilson',
    role: 'Technical Lead',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
]

const Team = () => {
  return (
    <section className="section__container">
      <span className="section__subtitle">Our Experts</span>
      <h2 className="section__title">Meet The Creative Minds</h2>
      
      <div className="team__grid">
        {teamMembers.map((member, index) => (
          <div className="team__card" key={index}>
            <img src={member.img} alt={member.name} className="team__member-img" />
            <h3>{member.name}</h3>
            <span>{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Team
