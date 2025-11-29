import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import mentorRoutes from './routes/mentorRoutes';
<<<<<<< HEAD
import eventRoutes from './routes/eventRoutes';
=======
<<<<<<< HEAD
>>>>>>> 168e333 (Feature: Add event creation and management endpoints)
import submissionRoutes from './routes/submissionRoutes';


=======
import eventRoutes from './routes/eventRoutes';
>>>>>>> feature/change
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
<<<<<<< HEAD
app.use('/api/events', eventRoutes);
=======
<<<<<<< HEAD
>>>>>>> 168e333 (Feature: Add event creation and management endpoints)
app.use('/api/submissions', submissionRoutes);

=======
app.use('/api/events', eventRoutes);
>>>>>>> feature/change
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});