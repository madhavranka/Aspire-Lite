import Loan from "../../src/models/Loan";
import LoanService from "../../src/services/LoanService";
import { jest } from "@jest/globals";
import PaymentService from "../../src/services/PaymentService";

const mockedLoan = Loan as jest.Mocked<typeof Loan>;

// Mock dependencies
jest.mock("../../src/models/Loan");
jest.mock("../../src/services/PaymentService");

describe("LoanService", () => {
  beforeEach(() => {
    mockedLoan.mockClear();
    jest.clearAllMocks();
  });

  describe("createLoanRequest", () => {
    it("should create a new loan request", async () => {
      const data = {
        customerId: 1,
        amount: 1000,
        noOfInstallments: 12,
        currency: "USD",
      };
      const loanData = {
        id: 1,
        ...data,
        status: "PENDING",
        principal: data.amount,
        interest: 0,
        remainingAmount: data.amount,
        repaymentSchedule: {},
      };
      mockedLoan.save.mockResolvedValueOnce({ dataValues: loanData } as any);

      const result = await LoanService.createLoanRequest(data);

      expect(result).toEqual({ ...loanData, id: "1" });
      expect(mockedLoan.save).toHaveBeenCalledWith({
        customerId: data.customerId,
        principal: data.amount,
        interest: 0,
        remainingAmount: data.amount,
        currency: data.currency,
        noOfInstallments: data.noOfInstallments,
        repaymentSchedule: expect.any(Object),
        status: "PENDING",
      });
    });

    it("should throw an error if an error occurs while creating a loan request", async () => {
      const data = {
        customerId: 1,
        amount: 1000,
        noOfInstallments: 12,
        currency: "USD",
      };
      mockedLoan.save.mockRejectedValueOnce(new Error("Failed to create loan"));

      await expect(LoanService.createLoanRequest(data)).rejects.toThrow(
        "Error creating Loan Request"
      );
    });
  });

  describe("updateLoanRequest", () => {
    it("should update a loan request and create installments if status is APPROVED", async () => {
      const loanId = "1";
      const decryptedLoanId = "1";
      const customerId = 1;
      const data = { status: "APPROVED" };
      const loanData = { id: decryptedLoanId, customerId, ...data };

      const loanInstance = Loan;

      jest.spyOn(loanInstance, "get").mockResolvedValueOnce(loanData);

      jest
        .spyOn(loanInstance, "get")
        .mockImplementationOnce(() =>
          loanInstance.get(parseInt(loanId), customerId)
        );

      mockedLoan.update.mockResolvedValueOnce(loanData as any);

      await LoanService.updateLoanRequest(loanId, customerId, data);

      expect(mockedLoan.update).toHaveBeenCalledWith(
        { id: parseInt(decryptedLoanId), customerId },
        data
      );
      expect(loanInstance.get).toHaveBeenCalledWith(
        parseInt(decryptedLoanId),
        customerId
      );
      expect(PaymentService.createInstallments).toHaveBeenCalledWith(loanData);
    });

    it("should return an empty object if loanId is null", async () => {
      const result = await LoanService.updateLoanRequest(null, 1, {});

      expect(result).toEqual({});
    });

    it("should throw an error if an error occurs while updating a loan request", async () => {
      const loanId = "encryptedLoanId";
      const customerId = 1;
      const data = {};

      mockedLoan.update.mockRejectedValueOnce(
        new Error("Failed to update loan")
      );

      await expect(
        LoanService.updateLoanRequest(loanId, customerId, data)
      ).rejects.toThrow("Error updating loan request");
    });
  });

  describe("getLoanById", () => {
    it("should return loan details by ID", async () => {
      const customerId = "1";
      const loanId = "encryptedLoanId";
      const decryptedLoanId = "1";
      const loanData = { id: decryptedLoanId, customerId };

      const loanInstance = Loan;

      jest.spyOn(loanInstance, "get").mockResolvedValueOnce(loanData);

      jest
        .spyOn(loanInstance, "get")
        .mockImplementationOnce(() =>
          loanInstance.get(parseInt(loanId), parseInt(customerId))
        );

      const result = await LoanService.getLoanById({ customerId, loanId });

      expect(result).toEqual({ ...loanData, id: loanId });
      expect(loanInstance.get).toHaveBeenCalledWith(
        parseInt(loanId),
        parseInt(customerId)
      );
    });

    it("should return null if loanId is null", async () => {
      const result = await LoanService.getLoanById({ customerId: "1" });
      expect(result).toBeNull();
    });
  });
});
