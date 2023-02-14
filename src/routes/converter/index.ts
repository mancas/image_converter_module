import express from 'express'
import ConverterController from '../../controllers/converter/ConverterController'

const router = express.Router()

router.post('/convert', ConverterController.convert)

export default router
