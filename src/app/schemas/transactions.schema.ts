import mongoose, { Schema, Document } from 'mongoose'

const TransactionsSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    type: String,
    date: Date,
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
  },
  { versionKey: false }
)

export default mongoose.model('Transactions', TransactionsSchema)
