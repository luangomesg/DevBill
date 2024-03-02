import { Request, Response } from 'express'

import packageJson from '../../../package.json'

class BaseController {
  async index(_: Request, res: Response) {
    const { name, version, description, author } = packageJson

    res.status(200).json({ name, version, description, author })
  }
}

export default new BaseController()
