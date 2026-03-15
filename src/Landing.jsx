import React, { useRef } from 'react';
import { Star, StarHalf, PlayCircle, BookOpen, Clock, CheckCircle } from 'lucide-react';
import './Landing.css';

export default function Landing({ onCourseClick, courses = [] }) {
  const catalogRef = useRef(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
       stars.push(<Star key={`full-${i}`} size={14} fill="#e59819" color="#e59819" />);
    }
    if (hasHalfStar) {
       stars.push(<StarHalf key="half" size={14} fill="#e59819" color="#e59819" />);
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
        stars.push(<Star key={`empty-${i}`} size={14} color="#e59819" />);
    }
    return stars;
  };

  return (
    <div className="landing-container">
      {/* 1. HERO SECTION (ConvertFlow format) */}
      <section className="hero-section">
        <div className="hero-pill">New Platform Launch</div>
        <h1 className="hero-title">Master Your Tech Stack Faster Than Ever</h1>
        <p className="hero-subtitle">
          Join thousands of students learning modern software engineering, web development, and design through our interactive video courses. Access all premium content and turbocharge your career today.
        </p>
        <button className="hero-cta" onClick={scrollToCatalog}>
          View Available Courses
        </button>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-overlay"></div>
          {/* A large visual indicator mimicking ConvertFlow's top mockup */}
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="trust-section">
        <h4 className="trust-title">Trusted By Developers Working At</h4>
        <div className="trust-logos">
          <span>Google</span>
          <span>Amazon</span>
          <span>Meta</span>
          <span>Netflix</span>
          <span>Microsoft</span>
        </div>
      </section>

      {/* 3. BENEFITS / FEATURES SECTION */}
      <section className="benefits-section">
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <PlayCircle size={32} />
            </div>
            <h3>On-Demand Video</h3>
            <p>Learn at your own pace with unlimited lifetime access to our high-definition interactive video lessons.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <BookOpen size={32} />
            </div>
            <h3>Project-Based Curriculum</h3>
            <p>Don't just watch videos. Build real-world portfolio applications alongside industry experts.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <CheckCircle size={32} />
            </div>
            <h3>Certificate of Completion</h3>
            <p>Earn an official certificate demonstrating your technical mastery when you complete all modules.</p>
          </div>
        </div>
      </section>

      {/* 4. COURSE CATALOG (Looping over our previous 10 courses) */}
      <section className="catalog-section" ref={catalogRef}>
        <h2 className="landing-title">Select Your Path</h2>
        <p className="landing-subtitle">Choose from our massive catalogue of industry-leading courses.</p>
        
        <div className="course-grid">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="course-card"
              onClick={() => onCourseClick(course)}
            >
              <div className="course-thumbnail" style={{ backgroundImage: `url(${course.thumbnail})` }}>
                <div className="course-thumbnail-overlay"></div>
                <div className="course-play-icon">
                  <div className="play-triangle"></div>
                </div>
              </div>
              
              <div className="course-info">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-instructor">{course.instructor}</p>
                
                <div className="course-rating-container">
                  <span className="rating-score">{course.rating.toFixed(1)}</span>
                  <div className="stars">
                    {renderStars(course.rating)}
                  </div>
                  <span className="rating-reviews">({course.reviews})</span>
                </div>
                
                <div className="course-pricing">
                  <span className="price-current">₹{course.price.toLocaleString('en-IN')}</span>
                  <span className="price-original">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="price-discount">{course.discount} off</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
