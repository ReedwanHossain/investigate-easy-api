import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import requestRoutes from './routes/request.routes';
import messageRoutes from './routes/message.routes';
import reportRoutes from './routes/report.routes';
import reviewRoutes from './routes/review.routes';
import { sendErrorResponse } from './utils/apiResponse';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reviews', reviewRoutes);



app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
  
app.use((req, res) => {
    sendErrorResponse(res, 404, 'Route not found');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    sendErrorResponse(res, 500, 'Internal server error');
});

export default app;