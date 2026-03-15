import { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle, Search, BookOpen, Clock, Code, Award, LogOut, ShoppingCart } from 'lucide-react';
import './index.css';
import Auth from './Auth';
import Landing from './Landing';
import CourseBuy from './CourseBuy';
import AiAssistant from './AiAssistant';
import { API_URL } from './config';

// Real Backend API Service integration

const backendService = {
  getAvailableCourses: async () => {
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },
  getCourseData: async (courseId) => {
    const res = await fetch(`${API_URL}/courses/${courseId}`);
    if (!res.ok) throw new Error("Failed to fetch course data");
    const course = await res.json();
    
    // Transform course structure minimally to match frontend expectations if necessary
    // E.g., Prisma nested creates might look slightly differently, but they are generally named identically: title, sections, etc.
    return course;
  },
  getLessonVideoUrl: async (lessonId) => {
    const res = await fetch(`${API_URL}/lessons/${lessonId}/video`);
    if (!res.ok) throw new Error("Failed to fetch lesson URL");
    const data = await res.json();
    return data.youtubeUrl;
  },
  enrollInCourse: async (userId, courseId) => {
    const res = await fetch(`${API_URL}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
    return res.json();
  },
  checkEnrollment: async (userId, courseId) => {
    const res = await fetch(`${API_URL}/enroll/${userId}/${courseId}`);
    if (res.status === 404) return null;
    return res.json();
  },
  getUserProgress: async (userId, courseId) => {
    const res = await fetch(`${API_URL}/progress/${userId}/${courseId}`);
    return res.json();
  },
  updateProgress: async (userId, courseId, progressData) => {
    const res = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, ...progressData })
    });
    return res.json();
  }
};

function App() {
  const [courses, setCourses] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(false); // Do not spin loader initially
  const [user, setUser] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'buy', 'learn'
  const [selectedBuyCourse, setSelectedBuyCourse] = useState(null);
  const [learningCourseObj, setLearningCourseObj] = useState(null);

  useEffect(() => {
     if (currentView === 'learn' && selectedBuyCourse) {
       backendService.getCourseData(selectedBuyCourse.id).then(c => setLearningCourseObj(c));
     }
  }, [currentView, selectedBuyCourse]);
  
  // Actually load available courses on landing page payload
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await backendService.getAvailableCourses();
        setCourses(fetchedCourses);
      } catch (e) {
        console.error("Failed to load generic courses", e);
      }
    };
    loadCourses();
  }, []);

  const USER_ID = user?.id || 'user123';

  useEffect(() => {
    // Navigation effect to load the course when entering the learning view
    if (currentView !== 'learn' || !selectedBuyCourse || !user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const courseData = await backendService.getCourseData(selectedBuyCourse.id);
        setLearningCourseObj(courseData);
        
        let userProgress = await backendService.getUserProgress(user.id, courseData.id);
        setCompletedLessons(userProgress.completedLessons || []);
        
        // Fetch enrollment (already enrolled upon buying previously)
        await backendService.checkEnrollment(user.id, courseData.id);

        let initialLesson = null;
        if (userProgress && userProgress.lastWatchedLesson && courseData.sections) {
          // Progress Tracker Module: resume from Last watched lesson
          for (const section of courseData.sections) {
            const found = section.lessons.find(l => l.id === userProgress.lastWatchedLesson);
            if (found) initialLesson = found;
          }
        }

        if (!initialLesson && courseData.sections.length > 0 && courseData.sections[0].lessons.length > 0) {
          initialLesson = courseData.sections[0].lessons[0];
        }

        if (initialLesson) {
          const youtubeUrl = await backendService.getLessonVideoUrl(initialLesson.id);
          setActiveLesson({ ...initialLesson, youtubeUrl });
          
          userProgress.lastWatchedLesson = initialLesson.id;
          await backendService.updateProgress(user.id, courseData.id, userProgress);
        }
      } catch (error) {
        console.error("Failed to load course", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentView, selectedBuyCourse, user]);

  const handleSelectLesson = async (lesson) => {
    // Student Clicks a Lesson
    // Frontend: Sends lesson ID to backend
    try {
      const youtubeUrl = await backendService.getLessonVideoUrl(lesson.id);
      // Frontend: Updates iframe source, YouTube player loads that video
      setActiveLesson({ ...lesson, youtubeUrl });
      
      const userProgress = await backendService.getUserProgress(user.id, selectedBuyCourse.id);
      userProgress.lastWatchedLesson = lesson.id;
      await backendService.updateProgress(user.id, selectedBuyCourse.id, userProgress);
    } catch (err) {
      console.error("Error fetching video URL", err);
    }
  };

  const toggleLessonComplete = async () => {
    if (!activeLesson || !selectedBuyCourse) return;

    let updatedCompleted = [...completedLessons];
    const isCompleted = updatedCompleted.includes(activeLesson.id);
    
    if (isCompleted) {
       updatedCompleted = updatedCompleted.filter(id => id !== activeLesson.id);
    } else {
       updatedCompleted.push(activeLesson.id);
    }
    
    setCompletedLessons(updatedCompleted);
    
    const courseObj = await backendService.getCourseData(selectedBuyCourse.id);
    const totalLessons = courseObj.sections.reduce((acc, section) => acc + section.lessons.length, 0);
    const newPercentage = totalLessons > 0 ? Math.round((updatedCompleted.length / totalLessons) * 100) : 0;
    
    const progressData = {
      completedLessons: updatedCompleted,
      percentage: newPercentage, // Progress Tracking Module: stores Percentage
      lastWatchedLesson: activeLesson.id
    };
    
    await backendService.updateProgress(user.id, selectedBuyCourse.id, progressData);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', color: 'white' }}>
        <h2>Loading Learning Environment...</h2>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(userData) => setUser(userData)} />;
  }

  // Calculate progress
  const totalLessons = learningCourseObj ? learningCourseObj.sections.reduce((acc, section) => acc + section.lessons.length, 0) : 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header" style={{ justifyContent: 'space-between' }}>
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('landing')}>
          <BookOpen size={28} color="var(--accent-color)" />
          Smart AI Learning Platform
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setIsAiOpen(!isAiOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-color)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#e59819', border: '1px solid var(--border-color)', fontWeight: 'bold', cursor: 'pointer' }}>
            <span>✨ AI Assistant</span>
          </button>
          
          <button style={{ background: 'transparent', color: 'var(--text-primary)', display: 'flex' }}>
            <ShoppingCart size={22} />
          </button>

          <button style={{ background: 'var(--surface-color-light)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: '600' }} onClick={() => setCurrentView('landing')}>
            Home
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--accent-color)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout Views */}
      {currentView === 'landing' && (
        <Landing 
          courses={courses}
          onCourseClick={(course) => {
            setSelectedBuyCourse(course);
            setCurrentView('buy');
          }} 
        />
      )}

      {currentView === 'buy' && (
        <CourseBuy 
          course={selectedBuyCourse} 
          onBack={() => setCurrentView('landing')}
          onPurchase={async () => {
            setLoading(true);
            await backendService.enrollInCourse(user.id, selectedBuyCourse.id);
            setLoading(false);
            setCurrentView('learn');
          }}
        />
      )}

      {currentView === 'learn' && learningCourseObj && (
        <main className="main-content">
        
        {/* Video Area */}
        <div className="video-area">
          <div className="video-container">
            {activeLesson ? (
              <iframe 
                src={`https://www.youtube.com/embed/${activeLesson.youtubeUrl}`} 
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                Select a lesson to begin
              </div>
            )}
          </div>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderLeft: '4px solid var(--accent-color)', margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem', borderRadius: '0 8px 8px 0' }}>
            <strong style={{ color: 'var(--text-primary)'}}>Important:</strong> Video is not stored in your system. You are only embedding YouTube video using its URL.
          </div>

          <div className="video-details">
            <div className="video-header">
              <div>
                <h1 className="current-lesson-title">{activeLesson?.title}</h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Code size={16} /> Course: {learningCourseObj.title}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} /> {activeLesson?.duration}
                  </span>
                </div>
              </div>
              
              <button 
                className={`btn-complete ${completedLessons.includes(activeLesson?.id) ? 'active' : ''}`}
                onClick={toggleLessonComplete}
              >
                <CheckCircle size={20} />
                {completedLessons.includes(activeLesson?.id) ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
            
            <div className="video-description">
              <strong style={{ color: 'var(--text-primary)' }}>About this lesson:</strong>
              <p style={{ marginTop: '0.5rem' }}>{activeLesson?.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar / Curriculum */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="course-title">{learningCourseObj.title}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Instructor: {learningCourseObj.instructor?.name || 'Instructor'}
            </div>
            
            <div className="progress-container">
              <div className="progress-text">
                <span>Course Progress</span>
                <span style={{ color: progressPercentage === 100 ? '#2ea043' : 'var(--text-primary)' }}>
                  {progressPercentage}%
                </span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercentage}%`, background: progressPercentage === 100 ? '#2ea043' : 'var(--accent-gradient)' }}
                ></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>{completedLessons.length} / {totalLessons} Lessons</span>
                {progressPercentage === 100 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2ea043' }}><Award size={14}/> Certified</span>
                )}
              </div>
            </div>
          </div>

          <div className="lesson-list">
            {learningCourseObj.sections.map((section, sIndex) => (
              <div key={section.id}>
                <div className="section-header">
                  Section {sIndex + 1}: {section.title}
                </div>
                {section.lessons.map((lesson, lIndex) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isActive = activeLesson?.id === lesson.id;
                  
                  return (
                    <div 
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="lesson-icon">
                        {isCompleted ? <CheckCircle size={14} /> : (isActive ? <PlayCircle size={14} /> : lIndex + 1)}
                      </div>
                      <div className="lesson-info">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-duration">
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        </main>
      )}

      {isAiOpen && (
        <AiAssistant onClose={() => setIsAiOpen(false)} />
      )}
    </div>
  );
}

export default App;
