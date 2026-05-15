import { Router } from 'express';
import { searchData } from '../controllers/search.controller.js';

const router = Router();

router.get('/search', searchData);

export default router;