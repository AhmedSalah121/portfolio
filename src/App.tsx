import NavBar from './componenets/nav-bar';
import classes from './App.module.css';
import Footer from './componenets/footer';
import ImageCard from './componenets/image-card';
import TechStack from './componenets/tech-stack';

function App() {
  return (
    <div className={classes.main}>
      <NavBar />
      
      <section id="lore">
        <ImageCard
          images={[
            './iorto1.jpeg',
            './iorto2.jpeg',
            './iorto4.jpeg',
            './iorto5.jpeg',
          ]}
          title='Backend Engineer - Iorto Lounge (2024/12 - 2025/08)'
          description='Built a Table Reservation System with NodeJS & TypeScript using the MVC architecture, serving both a management dashboard and a mobile app. Applied TDD principles with Jest for unit testing controllers and integration testing database repositories to validate upsert and fetch operations. Developed the Reservation controller to handle creation, modification, and cancellation requests with data integrity and eligibility validation, and the Identity controller for user information CRUD operations and phone number validation. Implemented an SMS gateway with Taqnyat for OTP-based phone verification and built authentication middleware to distinguish between mobile app (user) and dashboard (admin) requests, authenticating via Firebase or Auth0. Optimized table availability using a sliding window technique, maintained a linear Git history with feature branches and rebasing, and developed 21 public API endpoints documented with OpenAPI. Technology stack included Vercel, PostgreSQL, Prisma ORM, Prisma Migrator, Aiven, Jest, ESLint, Husky, and Docker.'
          layout='left'
          autoSlide={true}
          slideInterval={4500}
          screenshotType='mobile'
        />
        <div className={classes.cardSeparator}></div>
        <ImageCard
          images={[]}
          title='Backend Engineer Internship - Flash (2022/01 - 2022/03)'
          description='Contributed to the MVP development of a bill payment and scan-to-pay system. Developed the business logic for bill inquiry, enabling accurate and efficient bill retrieval. Designed and prepared the database schema to support bill lookup and transaction records. Technology Stack: Golang, gRPC, GraphQL, PostgreSQL, golang-migrate, go-sqlmock, Testify, GitHub Actions, Docker.'
          layout='right'
          autoSlide={true}
          slideInterval={4500}
          screenshotType='desktop'
        />
        <div className={classes.cardSeparator}></div>
        <ImageCard
          images={[
            './grad1.jpeg',
            './grad2.jpeg',
            './grad3.jpeg',
            './grad4.jpeg',
          ]}
          title='AI Researcher Engineer - Graduation Project'
          description='Fine-tuned DistilBERT model using a dataset of 400,000 amazon reviews using PyTorch, Scikit-Learn frameworks and Pandas, Matplotlib in the preprocessing part. The dataset was splitted into 80% training, 20% testing. Preprocessing: Remove special characters and tokenized using DistilBertTokenizer. Training: Fine-tuned DistilBERT with AdamW optimizer, cross-entropy loss function, and a learning rate scheduler. Deployment: Integrated into a Flask API that takes the product link, scrapes reviews live on hit, runs them through the preprocessing pipeline and finally to the model, and visualizes positive vs. negative sentiment using Matplotlib. Technologies Stack: Python, Flask, NLP, PyTorch, scikit-learn, BERT, pandas, matplotlib, re, git.'
          layout='left'
          autoSlide={true}
          slideInterval={4500}
          screenshotType='desktop'
        />
      </section>

      {/* Tech Stack Section */}
      <section id="techstack">
        <TechStack />
      </section>

      {/* About & Contact Section (Footer) */}
      <section id="about">
        <Footer
          name='Ahmed Salah'
          title='FullStack Developer'
          phone='+20 1121097405'
          email='ahmedsalahabdellatif@gmail.com'
          location='15th of May City Cairo, Egypt'
          socialLinks={{
            linkedin: 'https://linkedin.com/in/ahmedsalah121',
            github: 'https://github.com/AhmedSalah121',
            leetcode: 'https://leetcode.com/u/AhmedSalah121',
          }}
        />
      </section>
    </div>
  );
}

export default App;
