import { Router } from 'express'
import carto from 'api/carto'

const router = new Router()
router.use('/carto', carto)
export default router
