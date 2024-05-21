import PaymentModel from "../database/models/payment";
import LoanModel from "../database/models/loan";

class Payment {
  public id: number | null;
  public payment: any;

  public constructor(id: number | null = null) {
    this.id = id;
  }

  public async get() {
    if (this.id) {
      this.payment = await PaymentModel.findOne({
        attributes: [
          "id",
          "customerId",
          "amount",
          "loanId",
          "status",
          "updatedAt",
        ],
        where: { id: this.id },
        include: [
          {
            model: LoanModel,
            attributes: [
              "id",
              "principal",
              "interest",
              "currency",
              "remainingAmount",
            ],
          },
        ],
      });
      return this.payment;
    }
  }

  public static async createPayment(data: any): Promise<boolean> {
    return await Payment.save(data);
  }

  public static async update(whereCondition: any, updateObj: any) {
    const updatedRowObject = await PaymentModel.update(updateObj, {
      where: whereCondition,
      returning: true,
    });
    if (updatedRowObject && updatedRowObject[0] === 1) {
      return updatedRowObject[1][0];
    }
  }

  public static async save(data: any): Promise<boolean> {
    PaymentModel.create(data);
    return true;
  }
}

export default Payment;
