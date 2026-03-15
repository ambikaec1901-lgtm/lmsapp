export const MOCK_COURSES = [
  {
    id: 'c1',
    title: 'TypeScript Masterclass',
    description: 'Learn TypeScript from scratch to advanced concepts.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst101',
    category: 'Programming',
    rating: 4.2,
    reviews: '85,248',
    price: 1299,
    originalPrice: 4245,
    discount: '69%',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    color: '#007acc'
  },
  {
    id: 'c2',
    title: 'DevOps with Docker & Kubernetes',
    description: 'Master Docker and Kubernetes for container orchestration.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst102',
    category: 'DevOps',
    rating: 4.0,
    reviews: '151,145',
    price: 4999,
    originalPrice: 33197,
    discount: '85%',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    color: '#2496ed'
  },
  {
    id: 'c3',
    title: 'SQL & Database Design',
    description: 'Design robust databases with SQL.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst103',
    category: 'Database',
    rating: 4.8,
    reviews: '75,022',
    price: 999,
    originalPrice: 3127,
    discount: '68%',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    color: '#f29111'
  },
  {
    id: 'c4',
    title: 'Python for Data Science',
    description: 'A comprehensive guide to Data Science using Python.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst104',
    category: 'Data Science',
    rating: 4.4,
    reviews: '147,840',
    price: 1499,
    originalPrice: 6399,
    discount: '77%',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&q=80',
    color: '#3776ab'
  },
  {
    id: 'c5',
    title: 'React.js Complete Guide',
    description: 'Build powerful interactive UIs with React.js.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst105',
    category: 'Web Development',
    rating: 4.4,
    reviews: '125,048',
    price: 3499,
    originalPrice: 24126,
    discount: '85%',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    color: '#61dafb'
  },
  {
    id: 'c6',
    title: 'Machine Learning for Beginners',
    description: 'Enter the world of AI and Machine Learning.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst106',
    category: 'Artificial Intelligence',
    rating: 4.8,
    reviews: '29,462',
    price: 9999,
    originalPrice: 43629,
    discount: '77%',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    color: '#ff6f00'
  },
  {
    id: 'c7',
    title: 'Data Structures and Algorithms',
    description: 'Ace your coding interviews with DSA.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst107',
    category: 'Computer Science',
    rating: 4.4,
    reviews: '27,168',
    price: 4999,
    originalPrice: 26067,
    discount: '81%',
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
    color: '#4caf50'
  },
  {
    id: 'c8',
    title: 'Web Development for Beginners',
    description: 'Learn HTML, CSS, and basic vanilla JavaScript.',
    instructor: 'Dr. Instructor',
    instructorId: 'inst108',
    category: 'Web Development',
    rating: 4.4,
    reviews: '114,044',
    price: 3499,
    originalPrice: 17169,
    discount: '80%',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    color: '#e34c26'
  }
];

export const MOCK_COURSE_CONTENT = {
  id: 'c5', 
  title: 'React.js Complete Guide',
  description: 'Master enterprise software development from the backend with Spring Boot to the interactive frontend with React JS.',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  category: 'Web Development',
  instructor: 'Dr. Instructor',
  instructorId: 'inst105',
  sections: [
    {
      id: 's1',
      title: 'React Basics',
      lessons: [
        {
          id: 'l1',
          title: 'React Crash Course (Part 1)',
          order: 1,
          duration: '1h 20m',
          youtubeUrl: 'w7ejDZ8SWv8', 
          description: 'Learn the fundamentals of React, how to initialize a project, and basic concepts.'
        }
      ]
    },
    {
      id: 's2',
      title: 'React Navigation & Setup',
      lessons: [
        {
          id: 'l2',
          title: 'React Sidebar Navigation',
          order: 2,
          duration: '35m',
          youtubeUrl: 'xTtL8E4LzTQ',
          description: 'Build a responsive sidebar navigation menu using React Router and modern CSS techniques.'
        }
      ]
    }
  ]
};
