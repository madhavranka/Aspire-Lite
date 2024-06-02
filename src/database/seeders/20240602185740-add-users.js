"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("user", [
      {
        firstName: "Madhav",
        lastName: "Ranka",
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Test",
        lastName: "User",
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("user", null, {});
  },
};
