import express from 'express';
import { workLoadInputHandler } from '../controllers/pricing.controller.js';

const router = express.Router();

router.post("/gpu" , workLoadInputHandler);

export default router;