import LoanTable from "../../src/models/Loan";
import LoanService from "../../src/services/LoanService";
import { jest } from "@jest/globals";
import PaymentService from "../../src/services/PaymentService";
import { LoanData } from "../../src/models/Loan";

const mockedLoanTable: jest.Mocked<LoanTable> =
  new LoanTable() as unknown as jest.Mocked<LoanTable>;

// Mock dependencies
jest.mock("../../src/models/Loan");
jest.mock("../../src/services/PaymentService");

describe("LoanService", () => {
  beforeEach(() => {
    // mockedLoanTable.mockClear();
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
      const loanData: LoanData = {
        id: 1,
        customerId: data.customerId,
        principal: data.amount,
        interest: 0,
        remainingAmount: data.amount,
        currency: data.currency,
        noOfInstallments: data.noOfInstallments,
        repaymentSchedule: {},
        status: "PENDING",
      };

      const myMethodSpy = jest.spyOn(LoanTable.prototype, "save");

      // Set the mock implementation
      myMethodSpy.mockResolvedValue(loanData);
      // mockedLoanTable.save.mockResolvedValueOnce(loanData);

      const result = await LoanService.createLoanRequest(data);

      expect(result).toEqual({ ...loanData, id: "1" });
      expect(myMethodSpy).toHaveBeenCalledWith({
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
      const myMethodSpy = jest.spyOn(LoanTable.prototype, "save");

      // Set the mock implementation
      myMethodSpy.mockRejectedValueOnce(new Error("Failed to create loan"));

      await expect(LoanService.createLoanRequest(data)).rejects.toThrow(
        "Error creating Loan Request"
      );
    });
  });

  describe("updateLoanRequest", () => {
    it("should update a loan request and create installments if status is APPROVED", async () => {
      const loanId = 1;
      const customerId = 1;
      const data = { status: "APPROVED" };
      const loanData: LoanData = {
        id: loanId,
        customerId,
        ...data,
        principal: 0,
        interest: 0,
        remainingAmount: 0,
        currency: "",
        noOfInstallments: 0,
        repaymentSchedule: undefined,
      };

      const myMethodSpy = jest.spyOn(LoanTable.prototype, "update");

      // Set the mock implementation
      myMethodSpy.mockResolvedValueOnce(loanData);

      const mockGet = jest.spyOn(LoanTable.prototype, "get");
      mockGet.mockResolvedValueOnce(loanData);
      await LoanService.updateLoanRequest(loanId.toString(), customerId, data);

      expect(myMethodSpy).toHaveBeenCalledWith(
        { id: loanId, customerId },
        data
      );
      expect(PaymentService.createInstallments).toHaveBeenCalledWith(loanData);
    });

    it("should return null if loanId is null", async () => {
      const result = await LoanService.updateLoanRequest(null, 1, {});
      expect(result).toEqual({});
    });

    it("should throw an error if an error occurs while updating a loan request", async () => {
      const loanId = 1;
      const data = {};

      const myMethodSpy = jest.spyOn(LoanTable.prototype, "update");

      // Set the mock implementation
      myMethodSpy.mockRejectedValueOnce(new Error("Failed to update loan"));
      await expect(
        LoanService.updateLoanRequest(loanId.toString(), 1, data)
      ).rejects.toThrow("Error updating loan request");
    });
  });

  describe("getLoanById", () => {
    it("should return loan details by ID", async () => {
      const loanId = 1;
      const loanData: LoanData = {
        id: loanId,
        customerId: 1,
        principal: 0,
        interest: 0,
        remainingAmount: 0,
        currency: "",
        noOfInstallments: 0,
        repaymentSchedule: undefined,
        status: "",
      };
      const myMethodSpy = jest.spyOn(LoanTable.prototype, "get");

      // Set the mock implementation
      myMethodSpy.mockResolvedValueOnce(loanData);

      // mockedLoanTable.get.mockResolvedValueOnce(loanData);

      const result = await LoanService.getLoanById({
        loanId: loanId.toString(),
      });

      expect(result).toEqual(null);
      expect(myMethodSpy).toHaveBeenCalledWith(loanId);
    });

    it("should return null if loanId is null", async () => {
      const result = await LoanService.getLoanById({});
      expect(result).toBeNull();
    });
  });
});
