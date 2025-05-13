import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import logger from '../config/logger';
import { TransactionType } from '../entity/transaction.entity';
import { TransactionService } from '../services/transaction.service';
import { createError } from '../utils';

const transferSchema = z.object({
  sourceAccountNumber: z.string().min(15, 'source account number is required'),
  destinationAccountNumber: z
    .string()
    .min(15, 'destination account number is required'),
  amount: z.number().positive('amount is required'),
  note: z.string().optional(),
});

export class TransactionController {
  transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async transfer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const {
        sourceAccountNumber,
        destinationAccountNumber,
        amount,
        note = '',
      } = transferSchema.parse(req.body);

      const userId = req.userId;

      const transaction = await this.transactionService.create({
        userId,
        sourceAccountNumber,
        destinationAccountNumber,
        amount,
        transactionType: TransactionType.TRANSFER,
        note,
      });

      logger.info(`Created new transaction: ${transaction.transactionId}`);

      return res.status(201).json({
        status: 'success',
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError('Invalid input', 400));
      }
      logger.error(error);
      return next(createError('Internal server error', 500));
    }
  }

  async getByTransactionId(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return next(createError('Transaction ID is required', 400));
      }
      const transaction =
        await this.transactionService.getByTransactionId(transactionId);

      if (transaction.userId !== req.userId) {
        return next(createError('Unauthorized', 401));
      }

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}
