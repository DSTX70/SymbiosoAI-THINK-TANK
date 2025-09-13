// In your Express server bootstrap (e.g., server.ts or app.ts)
// 1) Start worker once:
import { startDebateWorker } from './queue/queue';
startDebateWorker();

// 2) Use demo gate globally:
import { demoGate } from './middleware/auth/adapter';
app.use(demoGate);

// 3) Mount routes:
import debatesRouter from './routes/debates';
import exportRouter from './routes/export';
app.use('/api', debatesRouter);
app.use('/api', exportRouter);

// 4) Security headers (install helmet):
import helmet from 'helmet';
app.use(helmet());
