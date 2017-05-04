import { Router } from 'express'
import { render } from './controller'

const router = new Router();

router.post('/', render);

export default router;
