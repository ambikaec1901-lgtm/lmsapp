/* global process */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create an instructor
  const instructor = await prisma.user.create({
    data: {
      name: 'Dr. Instructor',
      email: 'instructor@example.com',
      role: 'Instructor'
    }
  });

  const coursesData = [
    {
      title: 'Java Course',
      description: 'Master Java basics, variables, data types, and Object-Oriented Programming.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
      category: 'Software Engineering',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Basics',
            lessons: {
              create: [
                { title: 'Variables', order: 1, youtubeUrl: 'w7ejDZ8SWv8', duration: '10m' },
                { title: 'Data Types', order: 2, youtubeUrl: 'xTtL8E4LzTQ', duration: '15m' },
                { title: 'OOP', order: 3, youtubeUrl: 'aEYhQikFOkk', duration: '35m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'React.js Complete Guide',
      description: 'Master enterprise software development from the backend with Spring Boot to the interactive frontend with React JS.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      category: 'Web Development',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'React Basics',
            lessons: {
              create: [
                { title: 'React Crash Course (Part 1)', order: 1, youtubeUrl: 'w7ejDZ8SWv8', duration: '1h 20m' }
              ]
            }
          },
          {
            title: 'React Navigation & Setup',
            lessons: {
              create: [
                { title: 'React Sidebar Navigation', order: 2, youtubeUrl: 'xTtL8E4LzTQ', duration: '35m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Python Masterclass',
      description: 'Learn Python programming from scratch. Includes real-world projects and examples.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&q=80',
      category: 'Programming',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Introduction to Python',
            lessons: {
              create: [
                { title: 'Installing Python', order: 1, youtubeUrl: 'rfscVS0vtbw', duration: '15m' },
                { title: 'Hello World', order: 2, youtubeUrl: 'kqtD5dpn9C8', duration: '10m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'UI/UX Design Bootcamp',
      description: 'Design beautiful interfaces with Figma and learn user experience principles.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      category: 'Design',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Figma Basics',
            lessons: {
              create: [
                { title: 'Introduction to Figma', order: 1, youtubeUrl: 'jwKmEVkH1u8', duration: '20m' },
                { title: 'Auto Layout', order: 2, youtubeUrl: 'TdQzE7XpB6g', duration: '25m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Advanced Data Structures in C++',
      description: 'Master trees, graphs, maps, sets, and algorithm optimizations step by step.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      category: 'Software Engineering',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Graphs & Trees',
            lessons: {
              create: [
                { title: 'Binary Search Trees', order: 1, youtubeUrl: 'pYT9F8_LFTM', duration: '40m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Angular for Flight Apps',
      description: 'Build robust scalable frontend applications using Angular modules.',
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
      category: 'Web Development',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Angular Basics',
            lessons: {
              create: [
                { title: 'Dependency Injection', order: 1, youtubeUrl: 'gLZJsFkO-3o', duration: '22m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Machine Learning A-Z',
      description: 'Create Machine Learning Algorithms in Python and R from two Data Science experts.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
      category: 'Data Science',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Data Preprocessing',
            lessons: {
              create: [
                { title: 'Importing Datasets', order: 1, youtubeUrl: '1vsmaEfbnoE', duration: '30m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'AWS Certified Cloud Practitioner',
      description: 'Begin your cloud computing journey with Amazon Web Services fundamentals.',
      thumbnail: 'https://images.unsplash.com/photo-1510511459019-5efa3702466d?w=800&q=80',
      category: 'Cloud Computing',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'AWS Core Services',
            lessons: {
              create: [
                { title: 'EC2 Instances', order: 1, youtubeUrl: 'BGx6kheY8G4', duration: '28m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'PostgreSQL Bootcamp',
      description: 'Learn SQL, PostgreSQL, and advanced database engineering principles.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
      category: 'Database Engineering',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Relational Database Queries',
            lessons: {
              create: [
                { title: 'SELECT statements and JOINs', order: 1, youtubeUrl: 'qw--VYLpxG4', duration: '50m' }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Go (Golang): The Complete Bootcamp',
      description: 'Learn Google\'s incredibly fast Go language to build robust networking services.',
      thumbnail: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
      category: 'Backend Development',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Getting Started with Go',
            lessons: {
              create: [
                { title: 'Goroutines and Channels', order: 1, youtubeUrl: 'LvgVSSpwND8', duration: '45m' }
              ]
            }
          }
        ]
      }
    }
  ];

  for (const data of coursesData) {
    await prisma.course.create({ data });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
