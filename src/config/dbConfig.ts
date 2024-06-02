import { Options, Sequelize } from "sequelize";
import { initializeLoan } from "../database/models/loan";
import { initializePayment } from "../database/models/payment";
import path from "path";
import { initializeRole } from "../database/models/role";
import { initializeUser } from "../database/models/user";

export const getJsonData = () => {
  const fs = require("fs");

  // Path to your JSON file
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "database",
    "config",
    "config.json"
  );

  let jsonData = {
    development: {
      username: "aspireapp",
      password: "",
      database: "aspiredb",
      host: "127.0.0.1",
      dialect: "postgres",
      port: 5432,
      use_env_variable: 0,
    },
  };

  try {
    jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error reading file or parsing JSON:", error);
  }
  return jsonData;
};

const sequelize = new Sequelize(getJsonData()["development"] as Options);

const connect = async () => {
  try {
    await sequelize.authenticate();
    initializeLoan(sequelize);
    initializePayment(sequelize);
    initializeRole(sequelize);
    initializeUser(sequelize);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default { connect };
