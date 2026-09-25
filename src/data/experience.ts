export interface Experience {
  role: string;
  company: string;
  dateRange: string;
  summary?: string;
  achievements?: string[];
  technologies: string[];
  fullDescription?: string;
  images: string[];
  layout: 'left' | 'right';
  mediaType?: 'screenshot-desktop' | 'screenshot-mobile' | 'logo' | 'none';
  screenshotType?: 'mobile' | 'desktop';
  autoSlide?: boolean;
  slideInterval?: number;
  isCurrent?: boolean;
}

export const experiences: Experience[] = [
  {
    role: 'Software Engineer',
    company: 'FOE',
    dateRange: 'June 2026 — Present',
    isCurrent: true,
    // TODO: add summary + achievement bullets
    achievements: [],
    technologies: [
      'Flutter',
      'Dart',
      'ASP.NET',
      'C#',
      'SQL Server',
      'Green-Blue Deployment',
    ],
    fullDescription: '',
    images: [],
    layout: 'left',
    mediaType: 'logo',
  },
  {
    role: 'Backend Engineer',
    company: 'Iorto Lounge',
    dateRange: '2024/12 - 2025/08',
    summary:
      'Built a Table Reservation System with NodeJS & TypeScript using the MVC architecture, serving both a management dashboard and a mobile app. Applied TDD principles with Jest for unit and integration testing across controllers and database repositories.',
    achievements: [
      'Developed Reservation and Identity controllers with data integrity validation and phone number verification via Taqnyat SMS gateway.',
      'Built authentication middleware distinguishing mobile app (Firebase) and dashboard (Auth0) requests.',
      'Optimized table availability using a sliding window technique.',
      'Developed public API endpoints documented with OpenAPI.',
      'Maintained a linear Git history with feature branches and rebasing.',
    ],
    technologies: [
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'Prisma',
      'Jest',
      'Docker',
      'Vercel',
      'Firebase',
      'Auth0',
    ],
    fullDescription:
      'Built a Table Reservation System with NodeJS & TypeScript using the MVC architecture, serving both a management dashboard and a mobile app. Applied TDD principles with Jest for unit testing controllers and integration testing database repositories to validate upsert and fetch operations. Developed the Reservation controller to handle creation, modification, and cancellation requests with data integrity and eligibility validation, and the Identity controller for user information CRUD operations and phone number validation. Implemented an SMS gateway with Taqnyat for OTP-based phone verification and built authentication middleware to distinguish between mobile app (user) and dashboard (admin) requests, authenticating via Firebase or Auth0. Optimized table availability using a sliding window technique, maintained a linear Git history with feature branches and rebasing, and developed public API endpoints documented with OpenAPI. Technology stack included Vercel, PostgreSQL, Prisma ORM, Prisma Migrator, Aiven, Jest, ESLint, Husky, and Docker.',
    images: [
      './iorto1.jpeg',
      './iorto2.jpeg',
      './iorto3.jpeg',
      './iorto4.jpeg',
      './iorto5.jpeg',
    ],
    layout: 'right',
    mediaType: 'screenshot-mobile',
    screenshotType: 'mobile',
    autoSlide: true,
    slideInterval: 4500,
  },
  {
    role: 'Backend Engineer Internship',
    company: 'Flash',
    dateRange: '2022/01 - 2022/03',
    summary:
      'Contributed to the MVP development of a bill payment and scan-to-pay system. Developed the business logic for bill inquiry and designed the database schema to support bill lookup and transaction records.',
    achievements: [
      'Developed business logic for bill inquiry, enabling accurate and efficient bill retrieval.',
      'Designed and prepared the database schema for bill lookup and transaction records.',
      'Contributed to MVP development of a scan-to-pay payment system.',
    ],
    technologies: [
      'Golang',
      'gRPC',
      'GraphQL',
      'PostgreSQL',
      'Docker',
      'GitHub Actions',
    ],
    fullDescription:
      'Contributed to the MVP development of a bill payment and scan-to-pay system. Developed the business logic for bill inquiry, enabling accurate and efficient bill retrieval. Designed and prepared the database schema to support bill lookup and transaction records. Technology Stack: Golang, gRPC, GraphQL, PostgreSQL, golang-migrate, go-sqlmock, Testify, GitHub Actions, Docker.',
    images: ['./flash-logo.svg'],
    layout: 'left',
    mediaType: 'logo',
    screenshotType: 'desktop',
    autoSlide: true,
    slideInterval: 4500,
  },
  {
    role: 'AI Researcher Engineer',
    company: 'Graduation Project',
    dateRange: '2024 - 2025',
    summary:
      'Fine-tuned a DistilBERT model on Amazon reviews for sentiment analysis. Built a Flask API that scrapes product reviews live and visualizes positive vs. negative sentiment.',
    achievements: [
      'Fine-tuned DistilBERT with AdamW optimizer, cross-entropy loss, and a learning rate scheduler on an 80/20 train-test split.',
      'Preprocessed data by removing special characters and tokenizing with DistilBertTokenizer.',
      'Deployed a Flask API that scrapes reviews live and runs them through the preprocessing pipeline and model.',
      'Visualized positive vs. negative sentiment using Matplotlib.',
    ],
    technologies: [
      'Python',
      'Flask',
      'PyTorch',
      'BERT',
      'scikit-learn',
      'pandas',
      'matplotlib',
    ],
    fullDescription:
      'Fine-tuned DistilBERT model using a dataset of Amazon reviews using PyTorch, Scikit-Learn frameworks and Pandas, Matplotlib in the preprocessing part. The dataset was splitted into 80% training, 20% testing. Preprocessing: Remove special characters and tokenized using DistilBertTokenizer. Training: Fine-tuned DistilBERT with AdamW optimizer, cross-entropy loss function, and a learning rate scheduler. Deployment: Integrated into a Flask API that takes the product link, scrapes reviews live on hit, runs them through the preprocessing pipeline and finally to the model, and visualizes positive vs. negative sentiment using Matplotlib. Technologies Stack: Python, Flask, NLP, PyTorch, scikit-learn, BERT, pandas, matplotlib, re, git.',
    images: ['./grad1.jpeg', './grad2.jpeg', './grad3.jpeg', './grad4.jpeg'],
    layout: 'right',
    mediaType: 'screenshot-desktop',
    screenshotType: 'desktop',
    autoSlide: true,
    slideInterval: 4500,
  },
];
