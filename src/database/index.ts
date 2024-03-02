import mongoose from 'mongoose'

class DataBase {
  constructor() {
    this.mongo()
  }

  async mongo(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        return
      }
      console.log('Connecting to DB...')

      await mongoose.connect(process.env.MONGO_URL as string)
      console.log('DB Connected.')
    } catch (err) {
      throw new Error(`DB not connected, erro:${err}`)
    }
  }
}

export default new DataBase()
