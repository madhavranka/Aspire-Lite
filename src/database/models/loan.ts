// models/user.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export interface LoanAttributes {
  id?: number | null;
  customerId: number;
  principal: number;
  interest: number;
  remainingAmount: number;
  currency: string;
  repaymentSchedule: any;
  noOfInstallments: number;
  status: string;
  createdAt?: Date | string;
}

class LoanModel extends Model<LoanAttributes> implements LoanAttributes {
  public id: number | undefined;
  public customerId!: number;
  public principal!: number;
  public interest!: number;
  public remainingAmount!: number;
  public currency!: string;
  public repaymentSchedule!: JSON;
  public noOfInstallments!: number;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
  }
}

export const initializeLoan = (sequelize: Sequelize) => {
  LoanModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      principal: {
        type: DataTypes.DOUBLE,
      },
      interest: {
        type: DataTypes.DOUBLE,
      },
      remainingAmount: { type: DataTypes.DOUBLE },
      currency: { type: DataTypes.STRING },
      customerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      noOfInstallments: {
        type: DataTypes.INTEGER,
      },
      repaymentSchedule: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "loan",
      timestamps: true,
    }
  );
};

export default LoanModel;
