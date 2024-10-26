import 'dotenv/config'

import { handler } from './build/handler.js';
import express from 'express';
import http from 'http';
import { createTerminus } from '@godaddy/terminus'

const app = express();

app.use(handler);

const server = http.createServer(app)

createTerminus(server, {
  signals: ['SIGTERM', 'SIGINT'],
  onSignal: async () => {
  }
})

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
