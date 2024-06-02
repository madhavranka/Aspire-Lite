const { DataTypes } = require("sequelize");
const { Status } = require("../../../dist/database/models/payment");
module.exports = {
  async up(queryInterface) {
    // initializePayment(queryInterface.sequelize);
    await queryInterface.createTable(
      "payment",
      {
        id: {
          allowNull: false,
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
          allowNull: false,
          type: DataTypes.DATE,
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
            fields: ["scheduleDate"],
          },
        ],
      }
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable("payment");
  },
};
