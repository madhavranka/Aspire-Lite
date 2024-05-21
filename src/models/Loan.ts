import LoanModel from "../database/models/loan";

export type LoanData = {
  id?: string | number | null;
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

class Loan {
  static loanData: Map<number, LoanData> = new Map();

  public static async get(
    loanId: number,
    customerId: number
  ): Promise<LoanData | any> {
    if (loanId > 0) {
      if (Loan.loanData.has(loanId)) {
        return Loan.loanData.get(loanId);
      }
      if (loanId) {
        const queryResult = await LoanModel.findOne({
          attributes: [
            "id",
            "customerId",
            "principal",
            "interest",
            "remainingAmount",
            "currency",
            "noOfInstallments",
            "status",
            "createdAt",
          ],
          where: { id: loanId, customerId: customerId },
        });
        const loan: LoanData | any = queryResult?.dataValues;
        Loan.loanData.set(loanId, loan);
        return loan;
      }
    }
    return null;
  }

  public static async update(
    whereCondition: any,
    updateObj: any
  ): Promise<LoanData | any> {
    const updatedRowObject = await LoanModel.update(updateObj, {
      where: whereCondition,
      returning: true,
    });
    if (updatedRowObject && updatedRowObject[0] === 1) {
      Loan.loanData.set(whereCondition.id, updatedRowObject[1][0].toJSON());
      return updatedRowObject[1][0];
    }
  }

  public static async save(data: any): Promise<LoanModel> {
    return await LoanModel.create(data);
  }
}

export default Loan;
