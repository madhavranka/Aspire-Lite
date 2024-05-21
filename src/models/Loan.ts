import LoanModel from "../database/models/loan";

class Loan {
  public id: number | null;
  public loanData: any;

  public constructor(id: number | null = null) {
    this.id = id;
  }

  public async get(customerId: number) {
    if (this.id) {
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
        where: { id: this.id, customerId: customerId },
      });
      this.loanData = queryResult?.dataValues;
      return this.loanData;
    }
  }

  public static async update(whereCondition: any, updateObj: any) {
    const updatedRowObject = await LoanModel.update(updateObj, {
      where: whereCondition,
      returning: true,
    });
    if (updatedRowObject && updatedRowObject[0] === 1) {
      return updatedRowObject[1][0];
    }
  }

  public static async save(data: any): Promise<LoanModel> {
    return await LoanModel.create(data);
  }
}

export default Loan;
