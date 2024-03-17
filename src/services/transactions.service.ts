import { Request, Response } from 'express'

import transactionsSchema from '../app/schemas/transactions.schema'
import { ExpenseDTO } from '../dtos/expensedto'

export async function getExpenses(
  request: Request,
  response: Response,
  beginDate: string,
  endDate: string
): Promise<ExpenseDTO[]> {
  const aggregate = transactionsSchema.aggregate<ExpenseDTO>()
  const matchParams: Record<string, unknown> = {
    type: 'despesa'
  }

  if (beginDate || endDate) {
    matchParams.date = {
      ...(beginDate && { $gte: new Date(beginDate as string) }),
      ...(endDate && { $lte: new Date(endDate as string) })
    }
  }

  const result = await aggregate
    .match(matchParams)
    .lookup({
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'category'
    })
    .unwind('category')
    .group({
      _id: '$category._id',
      title: {
        $first: '$category.title'
      },
      color: {
        $first: '$category.color'
      },
      amount: {
        $sum: '$amount'
      }
    })

  return result
}
