import Payment from "../models/Payment";
import { Status } from "../database/models/payment";
import EncryptionService from "./EncryptionService";
import Loan from "../models/Loan";
import { getDates } from "../utils/dateUtil";
import logger from "../logger";

class PaymentService {
  static async createPaymentEntry(data: any): Promise<void> {
    try {
      if (data) {
        const paymentTableObject = new Payment();
        await paymentTableObject.save(data);
      }
    } catch (error: any) {
      logger.error(`Error creating payment entry ${error.message}`);
      throw new Error("Error creating payment entry");
    }
  }

  static createInstallments(loanData: any) {
    const installments: { amount: number; scheduleDate: Date }[] =
      PaymentService.createInstallmentData(loanData);

    installments.forEach(async (installment) => {
      await PaymentService.createPaymentEntry({
        amount: installment.amount,
        loanId: loanData.id,
        customerId: loanData.customerId,
        status: Status.PENDING,
        currency: loanData.currency,
        scheduleDate: installment.scheduleDate,
      });
    });
  }

  static createInstallmentData(
    loanData: any
  ): { amount: number; scheduleDate: Date }[] {
    const installments: { amount: number; scheduleDate: Date }[] = [];
    const paymentAmount: number = parseFloat(
      (loanData.remainingAmount / (loanData.noOfInstallments ?? 1)).toFixed(2)
    );
    let totalSplit: number = parseFloat(
      (paymentAmount * (loanData.noOfInstallments ?? 1)).toFixed(2)
    );
    const remainder: number = parseFloat(
      (loanData.remainingAmount - totalSplit).toFixed(2)
    );
    if (paymentAmount > 0) {
      for (let i = 0; i < loanData.noOfInstallments; i++) {
        let amount: number = paymentAmount;
        if (i === loanData.noOfInstallments - 1) {
          amount += remainder; // Adjust the last installment to account for the remainder
        }
        installments.push({
          amount: parseFloat(amount.toFixed(2)),
          scheduleDate: getDates(
            (i + 1) * (loanData.repaymentSchedule?.["frequency"] ?? 1),
            loanData.repaymentSchedule?.["type"] ?? "W",
            loanData.createdAt
          ),
        });
      }
    }
    return installments;
  }

  static async markAsPaid(
    paymentId: string | null,
    amount?: number | undefined
  ): Promise<boolean> {
    if (paymentId) {
      const decryptedPaymentId: number = parseInt(
        EncryptionService.decrypt(paymentId)
      );
      const paymentTableObject = new Payment();
      const paymentObject = await paymentTableObject.get(decryptedPaymentId);
      if (paymentObject && paymentObject.LoanModel) {
        if (amount && amount > paymentObject.amount) {
          paymentObject.amount = amount;
        }
        const updatedPaymentEntry = await paymentTableObject.update(
          {
            id: paymentObject.id,
            status: Status.PENDING,
            amount: paymentObject.amount,
          },
          { status: Status.PAID }
        );

        if (updatedPaymentEntry && updatedPaymentEntry.status === Status.PAID) {
          const loan = paymentObject.LoanModel;
          //update remainingAmount in loan
          let loanUpdateValues: any = {
            remainingAmount: Math.max(
              loan.remainingAmount - paymentObject.amount,
              0
            ),
          };
          if (loan.remainingAmount <= paymentObject.amount) {
            loanUpdateValues = { ...loanUpdateValues, status: "PAID" };
          }
          const loanTableObject = new Loan();
          loanTableObject.update({ id: loan.id }, loanUpdateValues);
        }
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}

export default PaymentService;
