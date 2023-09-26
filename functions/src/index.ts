import { onRequest } from 'firebase-functions/v2/https';
import * as express from 'express';

import { health } from './controllers/health';
import * as logger from 'firebase-functions/logger';

import * as admin from 'firebase-admin';
import { createAvatar } from './triggers/createAvatar';
admin.initializeApp();

const app = express();
logger.info('Starting functions');
app.get('/healthz', health);

export default onRequest(app);
export { createAvatar };
