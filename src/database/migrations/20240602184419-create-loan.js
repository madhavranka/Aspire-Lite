const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(
      "loan",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
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
          allowNull: true,
          type: DataTypes.JSONB,
        },
        status: {
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        indexes: [
          {
            fields: ["id", "customerId"],
          },
        ],
      }
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("loan");
  },
};
