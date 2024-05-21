import { Request, Response } from "express";
import LoanService from "../services/LoanService";

export class LoanController {
  static async getLoanById(req: Request, res: Response) {
    try {
      const loan = await LoanService.getLoanById(
        parseInt(req.params.customerId),
        req.params.loanId
      );
      res.status(200).json(loan);
    } catch (error: any) {}
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
        req.body.data
      );
      res.status(200).json(loan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
