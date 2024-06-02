import { Request, Response } from "express";
import LoanService from "../services/LoanService";
import logger from "../logger";

export type LoanDataResponse = {
  id: string;
  customerId: number;
  principal: number;
  interest: number;
  remainingAmount: number;
  currency: string;
  noOfInstallments: number;
  repaymentSchedule: any;
  status: string;
  updatedAt?: string;
  createdAt?: Date | string;
};

export class LoanController {
  static async getLoanById(req: Request, res: Response) {
    try {
      const loan = await LoanService.getLoanById(req.params);
      res.status(200).json(loan);
    } catch (error: any) {
      logger.error(`Error getting Loan by Id ${error.message}`);
    }
  }

  static async createLoanRequest(req: Request, res: Response): Promise<void> {
    try {
      const loan = await LoanService.createLoanRequest(req.body.data);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateLoanRequest(req: Request, res: Response): Promise<void> {
    try {
      const loan = await LoanService.updateLoanRequest(
        req.params.loanId,
        parseInt(req.params.customerId),
        req.body.data,
        req.session.role
      );
      loan ? res.status(200).json(loan) : res.sendStatus(403);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
