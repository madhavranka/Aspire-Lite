import express from "express";
require("dotenv").config();

import dbConfig from "./config/dbConfig";
import loanRouter from "./routes/loanRoutes";
import { secretValidation } from "./middlewares/validation";
import paymentRoutes from "./routes/paymentRoutes";

import logger from "./logger";
logger.info("Hello, world!");

const app = express();
const port = 3000;
app.use(express.json());
app.use(secretValidation);
app.use("/api/loan", loanRouter);
app.use("/api/payment", paymentRoutes);

dbConfig.connect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
