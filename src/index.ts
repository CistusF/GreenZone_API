import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import { SocketServer } from './server';
import { logger } from './utils/etc';

const app = express();
const httpServer = createServer(app);


httpServer.listen(process.env.PORT, () => {
    logger(`🛡️ listening on port ${process.env.PORT}`, "Server");
    new SocketServer(httpServer);
});