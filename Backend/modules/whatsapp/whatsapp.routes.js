import Routes from 'express';
import {sendMessage} from './whatsapp.controller.js';

const router = Routes();

router.post('/send', sendMessage);

export default router;