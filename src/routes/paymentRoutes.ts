import express from "express";
import { PaymentController } from "../controllers/PaymentController";
import validateRequest, {
  validateRequestParams,
} from "../middlewares/validation";
import * as yup from "yup";

export const PaymentSchema = yup.object().shape({
  loanId: yup.number().required("loanId is required"),
  amount: yup.number().required("amount is required").min(0),
  currency: yup.string(),
});

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/",
  validateRequest(PaymentSchema),
  PaymentController.createPayment
);

paymentRoutes.put(
  "/:paymentId/markAsPaid",
  validateRequestParams(
    yup.object().shape({
      paymentId: yup.string().required("paymentId is required"),
    })
  ),
  PaymentController.markAsPaid
);

export default paymentRoutes;
