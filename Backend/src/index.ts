import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import mentorRoutes from './routes/mentorRoutes';
import eventRoutes from './routes/eventRoutes';
import submissionRoutes from './routes/submissionRoutes';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});