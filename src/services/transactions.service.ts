import { Request, Response } from 'express'
import { z } from 'zod'

import transactionsSchema from '../app/schemas/transactions.schema'
import { BalanceDTO } from '../dtos/balance.dto'
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

export async function getFinancialEvolution(
  request: Request,
  response: Response
): Promise<BalanceDTO[] | Response> {
  const schema = z.object({
    year: z.string()
  })

  try {
    schema.parse(request.query)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
      return response.status(400).json({ error: errors })
    }
  }
  const aggregate = transactionsSchema.aggregate<BalanceDTO>()

  const { year } = request.query

  const result = await aggregate
    .match({
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    })
    .project({
      _id: 0,
      income: {
        $cond: [
          {
            $eq: ['$type', 'renda']
          },
          '$amount',
          0
        ]
      },
      expense: {
        $cond: [
          {
            $eq: ['$type', 'despesa']
          },
          '$amount',
          0
        ]
      },
      year: {
        $year: '$date'
      },
      month: {
        $month: '$date'
      }
    })
    .group({
      _id: ['$year', '$month'],
      incomes: {
        $sum: '$income'
      },
      expenses: {
        $sum: '$expense'
      }
    })
    .addFields({
      balance: {
        $subtract: ['$incomes', '$expenses']
      }
    })
    .sort({
      _id: 1
    })

  return result
}
