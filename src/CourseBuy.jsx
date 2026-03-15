import React from 'react';
import { PlayCircle, ShieldCheck, Infinity as InfinityIcon, MonitorSmartphone, Trophy, ArrowLeft } from 'lucide-react';
import './CourseBuy.css';

export default function CourseBuy({ course, onBack, onPurchase }) {
  if (!course) return null;

  return (
    <div className="course-buy-container">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} /> Back to Courses
      </button>

      <div className="course-buy-content">
        <div className="course-buy-main">
          <div className="course-buy-header">
            <h1 className="course-buy-title">{course.title}</h1>
            <p className="course-buy-subtitle">
              Master the skills needed to excel in this comprehensive, deep-dive curriculum.
            </p>
            
            <div className="course-buy-meta">
              <span className="course-buy-rating">
                ★ {course.rating.toFixed(1)}
              </span>
              <span className="course-buy-reviews">({course.reviews} ratings)</span>
              <span className="course-buy-students">104,231 students</span>
            </div>
            
            <div className="course-buy-instructor">
              Created by <a href="#">{course.instructor}</a>
            </div>
            
            <div className="course-buy-updates">
              <span className="update-badge">Last updated 10/2023</span>
              <span className="lang-badge">English</span>
            </div>
          </div>

          <div className="course-what-you-learn">
            <h2>What you'll learn</h2>
            <ul className="learning-list">
              <li><div className="check-icon">✓</div>Build enterprise-level applications from scratch</li>
              <li><div className="check-icon">✓</div>Understand advanced concepts and architectures</li>
              <li><div className="check-icon">✓</div>Deploy your applications to modern cloud providers</li>
              <li><div className="check-icon">✓</div>Best practices, design patterns, and performance optimization</li>
            </ul>
          </div>
        </div>

        <div className="course-purchase-sidebar">
          <div className="purchase-card">
            <div className="purchase-preview" style={{ backgroundImage: `url(${course.thumbnail})` }}>
              <div className="purchase-preview-overlay">
                <PlayCircle size={64} color="white" fill="rgba(0,0,0,0.5)" />
                <span>Preview this course</span>
              </div>
            </div>

            <div className="purchase-body">
              <div className="purchase-pricing">
                <div className="purchase-price-current">₹{course.price.toLocaleString('en-IN')}</div>
                <div className="purchase-price-original">₹{course.originalPrice.toLocaleString('en-IN')}</div>
                <div className="purchase-price-discount">{course.discount} off</div>
              </div>
              
              <div className="purchase-timer">
                <span className="timer-icon">⏱</span> <strong>5 hours</strong> left at this price!
              </div>

              <button className="btn-buy-now" onClick={() => onPurchase(course)}>
                Buy Now & Start Learning
              </button>
              
              <p className="money-back">30-Day Money-Back Guarantee</p>
              
              <div className="course-includes">
                <h3>This course includes:</h3>
                <ul>
                  <li><PlayCircle size={16} /> 42 hours on-demand video</li>
                  <li><MonitorSmartphone size={16} /> Access on mobile and TV</li>
                  <li><ShieldCheck size={16} /> Full lifetime access</li>
                  <li><Trophy size={16} /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
