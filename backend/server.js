import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketServer } from 'socket.io';

import webhookRouter from './routes/webhook.js';
import flowEndpointRouter from './routes/flowEndpoint.js';
import contactLeadRouter from './routes/contactLead.js';
import leadsRouter from './routes/leads.js';
import crmRouter from './routes/crm.js';
import adminRouter from './routes/admin.js';
import assetsRouter from './routes/assets.js';
import settingsRouter from './routes/settings.js';
import logger from './services/logger.js';
import { setIo } from './services/eventBus.js';
import { startNurtureScheduler } from './services/nurture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SERVER_STARTED_AT = new Date();

// ── Socket.IO for live lead alerts ──────────────────────────────────────────
const io = new SocketServer(server, { cors: { origin: '*' } });
app.set('io', io);
setIo(io);
io.on('connection', (socket) => {
  socket.join('admin');
  socket.on('disconnect', () => {});
});

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(
  express.json({
    limit: '2mb',
    verify: (req, _res, buf) => { req.rawBody = buf; }
  })
);
app.use(express.urlencoded({ extended: true }));

// ── Database ─────────────────────────────────────────────────────────────────
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB Atlas'))
  .catch((err) => logger.error('MongoDB connection error', { error: err.message }));

// ── Health ───────────────────────────────────────────────────────────────────
const MONGO_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

function buildHealthReport() {
  const mongoState = MONGO_STATES[mongoose.connection.readyState] || 'unknown';
  const has = (v) => Boolean(v && String(v).trim() && !v.includes('REPLACE'));
  const base = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
  return {
    service: 'CloudSwift WhatsApp Automation Backend',
    status: mongoState === 'connected' ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    startedAt: SERVER_STARTED_AT.toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    connections: {
      mongodb: { connected: mongoState === 'connected', state: mongoState },
      whatsapp: {
        configured: has(process.env.WA_TOKEN) && has(process.env.WA_PHONE_NUMBER_ID),
        phoneNumberId: process.env.WA_PHONE_NUMBER_ID || null
      },
      cloudinary: { configured: has(process.env.CLOUDINARY_CLOUD_NAME) && has(process.env.CLOUDINARY_API_KEY) }
    },
    whatsapp: {
      callbackUrl: `${base}/api/whatsapp/webhook`,
      verifyTokenConfigured: has(process.env.WA_VERIFY_TOKEN)
    },
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'Health check' },
      { path: '/api/whatsapp/webhook', method: 'GET/POST', description: 'Meta WhatsApp webhook' },
      { path: '/api/leads', method: 'GET', description: 'Leads (live SSE)' },
      { path: '/api/crm', method: 'GET/POST', description: 'CRM conversations' },
      { path: '/api/assets', method: 'GET/POST', description: 'Flow images & assets (Cloudinary)' },
      { path: '/api/settings', method: 'GET/PUT', description: 'System settings' },
      { path: '/api/admin/login', method: 'POST', description: 'Admin auth' },
      { path: '/api/admin/stats', method: 'GET', description: 'Dashboard stats' }
    ]
  };
}

app.get('/', (req, res) => res.json(buildHealthReport()));
app.get('/api/health', (req, res) => res.json(buildHealthReport()));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/whatsapp/webhook', webhookRouter);
app.use('/api/whatsapp/flow-endpoint', flowEndpointRouter);
app.use('/api/public/contact', contactLeadRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/crm', crmRouter);
app.use('/api/admin', adminRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/settings', settingsRouter);

// ── Start ────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  logger.info(`CloudSwift Backend listening on http://localhost:${PORT}`);
  startNurtureScheduler();
});

export { io };
