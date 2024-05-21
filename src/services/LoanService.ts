import { LoanAttributes } from "src/database/models/loan";
import Loan, { LoanData } from "../models/Loan";
import PaymentService from "./PaymentService";
import EncryptionService from "./EncryptionService";
import logger from "../logger";
import { ParamsDictionary } from "express-serve-static-core";

class LoanService {
  static async createLoanRequest(data: any): Promise<LoanData> {
    try {
      const newLoanData: LoanAttributes = {
        customerId: data.customerId,
        principal: data.amount,
        interest: 0,
        remainingAmount: data.amount,
        currency: data.currency ?? "USD",
        noOfInstallments: data.noOfInstallments,
        repaymentSchedule: {
          /* Your JSON data */
        },
        status: "PENDING",
      };
      const loan = (await Loan.save(newLoanData))?.dataValues;
      return {
        ...loan,
        id: EncryptionService.encrypt(loan.id?.toString() ?? ""),
      };
    } catch (error: any) {
      logger.error(
        `Error creating loan request for customer ${data.customerId}`
      );
      throw new Error(`Error creating Loan Request `);
    }
  }

  static async updateLoanRequest(
    loanId: string | null,
    customerId: number,
    data: any
  ) {
    try {
      if (loanId) {
        const decryptedLoanId: string = EncryptionService.decrypt(loanId);
        const result = await Loan.update(
          { id: parseInt(decryptedLoanId), customerId },
          data
        );
        if (data.status === "APPROVED") {
          const loanData = await Loan.get(
            parseInt(decryptedLoanId),
            customerId
          );
          PaymentService.createInstallments(loanData);
        }
        return result;
      } else {
        return {};
      }
    } catch (error: any) {
      logger.error(
        `Error creating payment installment entries for loan ${loanId} ${error.message}`
      );
      throw new Error(`Error updating loan request`);
    }
  }

  static async getLoanById(params: ParamsDictionary): Promise<LoanData | any> {
    const loanId = EncryptionService.decrypt(params.loanId);
    const customerId: number = parseInt(params.customerId);
    if (loanId) {
      let result = await Loan.get(parseInt(loanId), customerId);
      return { ...result, id: loanId };
    }
    return null;
  }
}

export default LoanService;
