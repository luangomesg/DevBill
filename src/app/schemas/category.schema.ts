import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    title: String,
    color: String
  },
  { versionKey: false }
)

export default mongoose.model('Category', CategorySchema)
