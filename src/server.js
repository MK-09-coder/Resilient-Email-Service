import 'dotenv/config';
import express from 'express';
import { nanoid } from 'nanoid';
import EmailService from './core/emailService.js';
import SendGridProvider from './providers/sendGridProvider.js';
import SESProvider from './providers/sesProvider.js';
import Queue from './core/queue.js';

const app = express();
app.use(express.json());

const queue = new Queue();
const emailService = new EmailService(
  [new SendGridProvider(), new SESProvider()],
  3,
  queue
);
emailService.runQueueLoop();

app.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  const id = nanoid();
  try {
    await emailService.send({ id, to, subject, html });
    res.json({ id, status: emailService.getStatus(id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/status/:id', (req, res) =>
  res.json({ status: emailService.getStatus(req.params.id) })
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API @ http://localhost:${port}`));
