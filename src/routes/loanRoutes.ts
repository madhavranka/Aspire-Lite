import express from "express";
import { Request, Response, NextFunction } from "express";
import { LoanController } from "../controllers/LoanController";
import validateRequest, {
  validateRequestParams,
  LoanRequestSchema,
  GetLoanSchema,
  updateLoanSchema,
  validateEditLoanRequest,
} from "../middlewares/validation";

const loanRouter = express.Router();

loanRouter.get(
  "/:loanId/:customerId",
  validateRequestParams(GetLoanSchema),
  LoanController.getLoanById
);

loanRouter.post(
  "/",
  validateRequest(LoanRequestSchema),
  LoanController.createLoanRequest
);

loanRouter.put(
  "/:loanId/:customerId",
  validateEditLoanRequest(GetLoanSchema, updateLoanSchema),
  LoanController.updateLoanRequest
);

export default loanRouter;
