/* global process */
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- Authentication & Authorization ---
app.post('/api/auth/login', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { name, email, role } });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AI Assistant Module ---
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  const msg = message.trim();
  
  if (!msg) return res.json({ reply: "Ask me anything!" });

  // Basic conversational fallback catchers
  const lowered = msg.toLowerCase();
  if (lowered === 'hello' || lowered === 'hi' || lowered === 'hey') {
    return res.json({ reply: "Hi there! What are you learning today?" });
  }

  try {
    // 1. Search Wikipedia for the closest topic
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(msg)}&utf8=&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.query && searchData.query.search.length > 0) {
      // 2. Fetch the text extract for the top hit
      const title = searchData.query.search[0].title;
      const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&exlimit=1&titles=${encodeURIComponent(title)}&explaintext=1&format=json`;
      const extractRes = await fetch(extractUrl);
      const extractData = await extractRes.json();
      
      const pages = extractData.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract;
        
        if (extract && extract.length > 20) {
          return res.json({ reply: extract });
        }
      }
    }
    
    // Fallback if no exact wiki hits
    res.json({ reply: "I'm sorry, I don't have enough context on that exact topic. Could you rephrase your question or ask me about something specific in your courses like Java, Python, or UI/UX?" });
    
  } catch (err) {
    console.error("AI Error:", err);
    res.json({ reply: "I'm currently having a little trouble connecting to my knowledge base, sorry about that!" });
  }
});

// --- Course Management & Returning Lesson Data ---
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: true }
    });
    // Transform to frontend model
    const result = courses.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail,
      category: c.category,
      instructorId: c.instructorId,
      instructor: c.instructor?.name || 'Dr. Instructor', // map from relation
      rating: 4.5,
      reviews: "1,200",
      price: 999,
      originalPrice: 1999,
      discount: "50%",
      color: "#007acc"
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!course) return res.status(404).json({ error: 'Not found' });

    // "Backend stores: Metadata only, YouTube video URL, No video files"
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/lessons/:id/video', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
    if (!lesson) return res.status(404).json({ error: 'Not found' });
    res.json({ youtubeUrl: lesson.youtubeUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Enrollment Handling ---
app.post('/api/enroll', async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    let enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    
    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: { userId, courseId }
      });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/enroll/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    res.json(enrollment || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Progress Tracking Module ---
app.get('/api/progress/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await prisma.progress.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    
    if (progress) {
      res.json({
        ...progress,
        completedLessons: JSON.parse(progress.completedLessons)
      });
    } else {
      res.json({
        completedLessons: [],
        percentage: 0,
        lastWatchedLesson: null
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/progress', async (req, res) => {
  const { userId, courseId, completedLessons, percentage, lastWatchedLesson } = req.body;
  try {
    const progress = await prisma.progress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {
        completedLessons: JSON.stringify(completedLessons),
        percentage,
        lastWatchedLesson
      },
      create: {
        userId,
        courseId,
        completedLessons: JSON.stringify(completedLessons),
        percentage,
        lastWatchedLesson
      }
    });

    res.json({
      ...progress,
      completedLessons: JSON.parse(progress.completedLessons)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend securely running on port ${PORT}`);
  });
}

export default app;
