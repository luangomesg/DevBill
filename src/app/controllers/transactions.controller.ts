import { Request, Response } from 'express'
import { Aggregate } from 'mongoose'
import { number, z } from 'zod'

import { BalanceDTO } from '../../dtos/balance.dto'
import { ExpenseDTO } from '../../dtos/expensedto'
import { CreateTransactionsDTO } from '../../dtos/transactions.dto'
import {
  getExpenses,
  getFinancialEvolution
} from '../../services/transactions.service'
import categorySchema from '../schemas/category.schema'
import transactionsSchema from '../schemas/transactions.schema'

class TransactionsControler {
  async create(
    request: Request<unknown, unknown, CreateTransactionsDTO>,
    response: Response
  ): Promise<Response> {
    const schema = z.object({
      title: z.string(),
      amount: z.number().int().positive(),
      type: z.enum(['despesa', 'renda', 'expense', 'income']),
      date: z.coerce.date(),
      categoryId: z.string().length(24)
    })

    try {
      schema.parse(request.body)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
        return response.status(400).json({ error: errors })
      }
    }
    const { title, date, amount, type, categoryId } = request.body

    const categoryExists = await categorySchema.findById(categoryId)
    if (!categoryExists) {
      return response.status(404).json({ error: 'category does not exist' })
    }
    console.log(categoryExists)

    const createTransactions = await transactionsSchema.create({
      title,
      date,
      amount,
      type,
      category: categoryExists
    })

    return response.status(200).json(createTransactions)
  }

  async index(request: Request, response: Response): Promise<Response> {
    const schema = z.object({
      title: z.string().optional(),
      categoryId: z.string().length(24).optional(),
      beginDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional()
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

    const { title, categoryId, beginDate, endDate } = request.query

    const whereParams: Record<string, unknown> = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(categoryId && { _id: categoryId })
    }

    if (beginDate || endDate) {
      whereParams.date = {
        ...(beginDate && { $gte: beginDate }),
        ...(endDate && { $lte: endDate })
      }
    }

    const transactions: CreateTransactionsDTO[] = await transactionsSchema
      .find(whereParams, undefined, {
        sort: {
          date: -1
        }
      })
      .populate('category')
    return response.json(transactions)
  }

  getDashboard = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const schema = z.object({
      beginDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional()
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

    const { beginDate, endDate } = request.query

    const aggregate = transactionsSchema.aggregate<BalanceDTO>()

    if (beginDate || endDate) {
      aggregate.match({
        date: {
          ...(beginDate && { $gte: new Date(beginDate as string) }),
          ...(endDate && { $lte: new Date(endDate as string) })
        }
      })
    }

    const [result] = await aggregate
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
        }
      })
      .group({
        _id: null,
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

    const expenses = await getExpenses(
      request,
      response,
      beginDate as string,
      endDate as string
    )

    if (!result) {
      return response.json({
        _id: null,
        incomes: 0,
        expenses: 0,
        balance: 0,
        expensesByCategory: expenses
      })
    }

    return response.json({ ...result, expensesByCategory: expenses })
  }

  getFinancial = async (
    request: Request,
    response: Response
  ): Promise<BalanceDTO[] | Response> => {
    const result = await getFinancialEvolution(request, response)

    return response.json({ result })
  }
}

export default new TransactionsControler()
