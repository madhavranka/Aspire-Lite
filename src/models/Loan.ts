import LoanModel from "../database/models/loan";
import DatabaseTable from "./DatabaseTable";

export type LoanData = {
  id?: number | null;
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

class LoanTable extends DatabaseTable<LoanData> {
  constructor() {
    super("loan");
  }

  public async save(data: LoanData): Promise<LoanData> {
    const loanModel = await LoanModel.create(data);
    return loanModel.toJSON();
  }

  public async update(
    whereCondition: any,
    data: Partial<LoanData>
  ): Promise<LoanData | null> {
    const [updatedCount, [updatedLoan]] = await LoanModel.update(data, {
      where: whereCondition,
      returning: true,
    });

    if (updatedCount === 1) {
      return updatedLoan.toJSON();
    }
    return null;
  }

  public async get(id: number): Promise<LoanData | null> {
    const loanModel = await LoanModel.findByPk(id);
    if (loanModel) {
      return loanModel.toJSON();
    }
    return null;
  }
}

export default LoanTable;
