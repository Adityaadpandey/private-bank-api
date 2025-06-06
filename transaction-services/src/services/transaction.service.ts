import { TRANSACTION_EVENT_TYPES } from '@private-bank/constants';
import { Repository } from 'typeorm';
import logger from '../config/logger';
import { AppDataSource } from '../data-source';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entity/transaction.entity';
import { publishTransactionEvent } from '../events/producers/transactionEvents.producer';
import { createError } from '../utils';

interface TransferTransactionDto {
  userId: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  transactionType: TransactionType;
  note?: string;
}

export class TransactionService {
  transactionRepository: Repository<Transaction>;

  constructor() {
    this.transactionRepository = AppDataSource.getRepository(Transaction);
  }

  async create(data: TransferTransactionDto): Promise<Transaction> {
    try {
      const transaction = new Transaction();
      transaction.userId = data.userId;
      transaction.sourceAccountNumber = data.sourceAccountNumber;
      transaction.destinationAccountNumber = data.destinationAccountNumber;
      transaction.amount = data.amount;
      transaction.transactionType = data.transactionType;
      transaction.note = data.note || '';
      transaction.status = TransactionStatus.INITIATED;

      await this.transactionRepository.save(transaction);

      logger.info(`transaction initialized: ${transaction.transactionId}`);

      await publishTransactionEvent({
        eventType: TRANSACTION_EVENT_TYPES.INITIATED,
        userId: transaction.userId,
        transactionId: transaction.transactionId,
        sourceAccountNumber: transaction.sourceAccountNumber,
        destinationAccountNumber: transaction.destinationAccountNumber,
        status: TransactionStatus.INITIATED,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        isInternal: transaction.isInternal,
      });

      return transaction;
    } catch (error) {
      throw createError(`Error creating transaction: ${error}`, 500);
    }
  }

  async updateStatus(
    transactionId: string,
    {
      status,
      errorDetails,
      sourceDebitedAt,
      destinationCreditedAt,
      compensatedAt,
      completedAt,
    }: {
      status: TransactionStatus;
      errorDetails?: string;
      sourceDebitedAt?: Date;
      destinationCreditedAt?: Date;
      compensatedAt?: Date;
      completedAt?: Date;
    },
  ): Promise<Transaction> {
    let transaction = await this.getByTransactionId(transactionId);

    transaction.status = status;
    transaction.details = errorDetails || '';
    transaction.sourceDebitedAt =
      sourceDebitedAt || transaction.sourceDebitedAt;
    transaction.destinationCreditedAt =
      destinationCreditedAt || transaction.destinationCreditedAt;
    transaction.compensatedAt = compensatedAt || transaction.compensatedAt;
    transaction.completedAt = completedAt || transaction.completedAt;

    await this.transactionRepository.save(transaction);
    logger.info(`transaction: ${transactionId} status updated to ${status}`);

    return transaction;
  }

  async getByTransactionId(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
    });

    if (!transaction) {
      throw createError(`Transaction ${transactionId} not found`, 404);
    }
    return transaction;
  }
}

export const transactionService = new TransactionService();
