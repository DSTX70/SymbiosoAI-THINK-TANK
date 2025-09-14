// Bootstrap server for testing
// This creates a minimal server setup that can be imported by tests
import express from 'express';
import { registerHealth } from '../server/health';

const app = express();

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register health endpoint first for CI/CD readiness
registerHealth(app);

// Basic routes for testing
app.get('/', (_req, res) => res.status(200).send('API online'));

export { app };