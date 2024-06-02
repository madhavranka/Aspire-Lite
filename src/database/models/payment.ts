import { Model, DataTypes, Sequelize } from "sequelize";
import LoanModel from "./loan";

export enum Status {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  INPROGRESS = "INPROGRESS",
}

export interface PaymentAttributes {
  id?: number;
  processorId: string | null | undefined;
  amount: number;
  customerId: number;
  loanId: number;
  status: Status;
  currency: string;
  scheduleDate: Date;
}

class PaymentModel
  extends Model<PaymentAttributes>
  implements PaymentAttributes
{
  public id: number | undefined;
  public processorId: string | null | undefined;
  public customerId!: number;
  public currency!: string;
  public loanId!: number;
  public status!: Status;
  public amount!: number;
  public scheduleDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
  }
}

export const initializePayment = (sequelize: Sequelize) => {
  PaymentModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      processorId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      loanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "loan",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(Status)),
        allowNull: false,
        defaultValue: Status.PENDING,
      },
      scheduleDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "payment",
      timestamps: true,
    }
  );
  PaymentModel.belongsTo(LoanModel, {
    foreignKey: "loanId",
  });
};

export default PaymentModel;
