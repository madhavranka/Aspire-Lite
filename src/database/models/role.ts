import { Model, DataTypes, Sequelize } from "sequelize";

export interface RoleAttributes {
  id?: number | null;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

class RoleModel extends Model<RoleAttributes> implements RoleAttributes {
  public id: number | undefined;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeRole = (sequelize: Sequelize) => {
  RoleModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "role",
      timestamps: true,
    }
  );
};

export default RoleModel;
