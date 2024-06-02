import { Model, DataTypes, Sequelize } from "sequelize";
import RoleModel from "./role";

export interface UserAttributes {
  id?: number | null;
  firstName: string | null;
  lastName: string | null;
  roleId: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id: number | undefined;
  public firstName!: string;
  public lastName!: string;
  public roleId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeUser = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "role",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: true,
    }
  );
  UserModel.belongsTo(RoleModel, {
    foreignKey: "roleId",
  });
};

export default UserModel;
