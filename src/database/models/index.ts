import { Sequelize, DataTypes, Options } from "sequelize";
import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import { env as _env } from "process";
import { getJsonData } from "@config/dbConfig";

const basename = _basename(__filename);
const env = _env.NODE_ENV || "development";
const config = getJsonData()["development"];

const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config as Options
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config as Options
  );
}

readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    // console.log(file);
    const model = require(join(__dirname + "", file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
