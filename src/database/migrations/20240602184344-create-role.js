const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("role", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
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
    });
    await queryInterface.bulkInsert("role", [
      {
        name: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("role");
  },
};
