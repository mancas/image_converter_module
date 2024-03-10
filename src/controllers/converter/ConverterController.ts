import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import fs from 'fs/promises'
import sharp, { FormatEnum } from 'sharp'

const STATUS = {
  200: 200,
  400: 400,
  500: 500,
}

export default {
  convert: async (req: Request, res: Response, next: NextFunction) => {
    console.info('here, convert')
    try {
      if (
        !req.headers['content-type'] ||
        !req.headers['content-type'].includes('multipart/form-data')
      ) {
        return res.status(STATUS[500]).send({ message: 'Invalid Request' })
      }

      const form = formidable({
        hashAlgorithm: 'sha1',
        multiples: true,
        filter: part => {
          const { mimetype } = part
          if (!mimetype) {
            return false
          }
          return mimetype.includes('image')
        },
      })

      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err)
          return
        }

        console.info('fields', fields)
        const to = fields.to as string
        if (!to) {
          res.status(STATUS[400]).send({ message: 'Missing required fields' })
          return
        }
        if (!sharp.format[to as keyof FormatEnum]) {
          res.status(STATUS[400]).send({
            message: `Invalid output format. Please select one of these: ${Object.keys(
              sharp.format,
            ).join(', ')}`,
          })
          return
        }

        if (!files || (files as unknown as formidable.File[])?.length === 0) {
          res.status(STATUS[400]).send({ message: 'Missing required files' })
          return
        }

        const results = []
        for await (const fileKey of Object.keys(files)) {
          const file = files[fileKey] as unknown as formidable.File
          const buffer = await fs.readFile(file.filepath)

          try {
            const data = await sharp(buffer)
              .toFormat(to as keyof FormatEnum)
              .toBuffer()
            results.push(data)
          } catch (error) {
            next(error)
            return
          }
        }

        res.send(results?.[0])
      })
    } catch (error) {
      next(error)
    }
  },
}
