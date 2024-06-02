import PaymentModel from "../database/models/payment";
import LoanModel from "../database/models/loan";
import DatabaseTable from "./DatabaseTable";

class Payment extends DatabaseTable<PaymentModel> {
  public payment: any;

  constructor() {
    super("payment");
  }

  public async save(data: any): Promise<any> {
    const paymentData = await PaymentModel.create(data);
    return paymentData.toJSON();
  }

  public async update(whereCondition: any, updateObj: any): Promise<any> {
    const [updatedCount, [updatedPaymentEntry]] = await PaymentModel.update(
      updateObj,
      {
        where: whereCondition,
        returning: true,
      }
    );
    if (updatedCount === 1) {
      return updatedPaymentEntry.toJSON();
    }
    return null;
  }

  public async get(id: number): Promise<any> {
    if (this.payment) {
      return this.payment.toJSON();
    }
    this.payment = await PaymentModel.findOne({
      attributes: [
        "id",
        "customerId",
        "amount",
        "loanId",
        "status",
        "updatedAt",
      ],
      where: { id },
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
    if (this.payment) {
      return this.payment.toJSON();
    }
    return null;
  }
}

export default Payment;
