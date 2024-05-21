import { LoanAttributes } from "src/database/models/loan";
import Loan from "../models/Loan";
import PaymentService from "./PaymentService";
import EncryptionService from "./EncryptionService";
import logger from "../logger";
import { ParamsDictionary } from "express-serve-static-core";

class LoanService {
  static async createLoanRequest(data: any) {
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
          //TODO : remove this query
          const loan = new Loan(parseInt(decryptedLoanId));
          const loanData = await loan.get(customerId);
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

  static async getLoanById(params: ParamsDictionary) {
    console.log(params);
    const loanId = EncryptionService.decrypt(params.loanId);
    const customerId: number = parseInt(params.customerId);
    if (loanId) {
      const loan = new Loan(parseInt(loanId));
      let result = await loan.get(customerId);
      return { ...result, id: loanId };
    }
    return null;
  }
}

export default LoanService;
