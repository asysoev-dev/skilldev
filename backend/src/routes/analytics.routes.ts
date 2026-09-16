import { Router } from 'express';
import {
    getTimeline,
    getSources,
    getFunnel,
    getManagers,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/timeline', getTimeline);
router.get('/sources', getSources);
router.get('/funnel', getFunnel);
router.get('/managers', getManagers);

export default router;