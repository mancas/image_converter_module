import { NextFunction, Request, Response } from 'express'
import ErrorAdapter from '../utils/errors/ErrorAdapter'

const cors = (_: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

const error = async (err: Error, _: Request, res: Response, next: NextFunction) => {
  const SERVER_ERROR = 500
  const error = new ErrorAdapter(err)
  res.status(SERVER_ERROR).send(error.toResponse())
  next()
}

export { cors, error }
