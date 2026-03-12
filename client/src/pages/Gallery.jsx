
import React from 'react'
import '../styles/General.css'

const galleryImages = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253361-b83f83ef9102?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520242739010-44e95bde329e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
]

const Gallery = () => {
  return (
    <section className="section__container">
      <span className="section__subtitle">Moments</span>
      <h2 className="section__title">Our Event Gallery</h2>
      
      <div className="gallery__grid">
        {galleryImages.map((img, index) => (
          <div className="gallery__item" key={index}>
            <img src={img} alt={`Gallery ${index}`} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Gallery