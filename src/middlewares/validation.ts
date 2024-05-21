import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

export const LoanRequestSchema = yup.object().shape({
  customerId: yup.number().required("customerId is required"),
  amount: yup.number().required("amount is required"),
  currency: yup.string(), // Optional field
  repaymentSchedule: yup.object({
    type: yup.string(),
    frequency: yup.number().min(0, "frequency must be a non-negative number"),
  }),
  noOfInstallments: yup.number().integer().required(),
});

export const GetLoanSchema = yup.object().shape({
  loanId: yup.string().required("loanId is required"),
  customerId: yup.string().required("customerId is required"),
});

export const updateLoanSchema = yup.object().shape({
  customerId: yup.number(),
  principal: yup.number(),
  currency: yup.string(), // Optional field
  repaymentSchedule: yup.object({
    type: yup.string(),
    frequency: yup.number().min(0, "frequency must be a non-negative number"),
  }),
  noOfInstallments: yup.number().integer(),
});

// Type for the validated data
export type LoanRequest = yup.InferType<typeof LoanRequestSchema>;

const validateRequest =
  (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      await schema.validate(req.body.data, { abortEarly: false });
      next();
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
  };

export const validateRequestParams =
  (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params, { abortEarly: false });
      next();
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
  };

export const validateEditLoanRequest =
  (paramsSchema: yup.ObjectSchema<any>, bodySchema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const combinedSchema = yup.object().shape({
        params: paramsSchema,
        body: bodySchema,
      });
      await combinedSchema.validate(
        { params: req.params, body: req.body.data },
        { abortEarly: false }
      );
      next();
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
  };

export const secretValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = req.headers.secret;
  if (!secret || secret != process.env.SECRET) {
    res.sendStatus(403);
    return;
  }
  next();
};
export default validateRequest;
