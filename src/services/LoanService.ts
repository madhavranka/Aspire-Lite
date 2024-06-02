import { LoanAttributes } from "src/database/models/loan";
import Loan, { LoanData } from "../models/Loan";
import PaymentService from "./PaymentService";
import EncryptionService from "./EncryptionService";
import logger from "../logger";
import { ParamsDictionary } from "express-serve-static-core";
import { LoanDataResponse } from "../controllers/LoanController";

class LoanService {
  static async createLoanRequest(data: any): Promise<LoanDataResponse> {
    try {
      const newLoanData: LoanAttributes = {
        customerId: data.customerId,
        principal: data.amount,
        interest: 0,
        remainingAmount: data.amount,
        currency: data.currency ?? "USD",
        noOfInstallments: data.noOfInstallments,
        repaymentSchedule: {},
        status: "PENDING",
      };
      const loanTableObject = new Loan();
      const loan = await loanTableObject.save(newLoanData);
      return {
        ...loan,
        id: EncryptionService.encrypt(loan.id?.toString() ?? ""),
      };
    } catch (error: any) {
      logger.error(
        `Error creating loan request for customer ${data.customerId} ${error}`
      );
      throw new Error(`Error creating Loan Request ${error.message}`);
    }
  }

  static async updateLoanRequest(
    loanId: string | null,
    customerId: number,
    data: {
      principal?: number;
      currency?: string;
      noOfInstallments?: number;
      repaymentSchedule?: any;
      status?: string;
    },
    userRole?: string
  ) {
    try {
      let result: any = {};
      if (loanId) {
        const decryptedLoanId: string = EncryptionService.decrypt(loanId);
        const loanTableObject = new Loan();
        const loanData = await loanTableObject.get(parseInt(decryptedLoanId));
        let result: any = {};
        if (loanData?.status && loanData.status === "PENDING") {
          if (data.status === "APPROVED") {
            if (userRole === "admin") {
              result = await loanTableObject.update(
                { id: parseInt(decryptedLoanId), customerId },
                data
              );
              PaymentService.createInstallments(loanData);
              return { ...result, id: loanId };
            } else {
              return null;
            }
          } else {
            result = await loanTableObject.update(
              { id: parseInt(decryptedLoanId), customerId },
              data
            );
            return { ...result, id: loanId };
          }
        } else {
          return { ...loanData, id: loanId };
        }
      }
      return result;
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
      const loanTableObject = new Loan();
      let result = await loanTableObject.get(parseInt(loanId));
      if (result?.customerId === customerId) {
        return { ...result, id: params.loanId };
      }
      return null;
    }
    return null;
  }
}

export default LoanService;
