import { Request, Response } from "express";
import PaymentService from "../services/PaymentService";

export class PaymentController {
  static async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const payment = await PaymentService.createPaymentEntry(req.body.data);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async markAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const result: boolean = await PaymentService.markAsPaid(
        req.params.paymentId,
        req.body.amount
      );
      res.status(200).json({});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
