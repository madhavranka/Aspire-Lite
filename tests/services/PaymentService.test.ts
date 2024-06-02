// tests/services/PaymentService.test.ts
import PaymentService from "../../src/services/PaymentService";
import PaymentModel, { Status } from "../../src/database/models/payment";
import EncryptionService from "../../src/services/EncryptionService";
import Loan from "../../src/models/Loan";
import Payment from "../../src/models/Payment";
import { getDates } from "../../src/utils/dateUtil";
import LoanTable from "../../src/models/Loan";

jest.mock("../../src/database/models/payment");
jest.mock("../../src/services/EncryptionService");
jest.mock("../../src/models/Loan");
jest.mock("../../src/models/Payment");
jest.mock("../../src/utils/dateUtil");

describe("PaymentService", () => {
  describe("createPaymentEntry", () => {
    it("should create a payment entry", async () => {
      const paymentData = {
        amount: 100,
        loanId: 1,
        customerId: 1,
        status: Status.PENDING,
        currency: "USD",
      };

      const mockSave = jest.spyOn(Payment.prototype, "save");
      mockSave.mockResolvedValueOnce(paymentData);

      await PaymentService.createPaymentEntry(paymentData);

      expect(mockSave).toHaveBeenCalledWith(paymentData);
    });

    it("should throw an error when creation fails", async () => {
      const paymentData = {
        amount: 100,
        loanId: 1,
        customerId: 1,
        status: Status.PENDING,
        currency: "USD",
      };

      const mockSave = jest.spyOn(Payment.prototype, "save");
      mockSave.mockRejectedValueOnce(new Error("Error creating payment entry"));

      await expect(
        PaymentService.createPaymentEntry(paymentData)
      ).rejects.toThrow("Error creating payment entry");
    });
  });

  describe("createInstallments", () => {
    it("should create installments and payment entries", async () => {
      const loanData = {
        id: 1,
        customerId: 1,
        remainingAmount: 1000,
        noOfInstallments: 4,
        currency: "USD",
        repaymentSchedule: { frequency: 1, type: "W" },
        createdAt: new Date(),
      };

      const installmentData = [
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
      ];

      jest
        .spyOn(PaymentService, "createInstallmentData")
        .mockReturnValueOnce(installmentData);
      jest
        .spyOn(PaymentService, "createPaymentEntry")
        .mockImplementation(jest.fn());

      await PaymentService.createInstallments(loanData);

      expect(PaymentService.createInstallmentData).toHaveBeenCalledWith(
        loanData
      );
      installmentData.forEach((installment) => {
        expect(PaymentService.createPaymentEntry).toHaveBeenCalledWith({
          amount: installment.amount,
          loanId: loanData.id,
          customerId: loanData.customerId,
          status: Status.PENDING,
          currency: loanData.currency,
          scheduleDate: installment.scheduleDate,
        });
      });
    });
  });

  describe("createInstallmentData", () => {
    const d: Date = new Date();
    it("should create installment data", () => {
      const loanData = {
        remainingAmount: 1000,
        noOfInstallments: 4,
        repaymentSchedule: { frequency: 1, type: "W" },
        createdAt: d,
      };

      const expectedInstallments = [
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
      ];

      (getDates as jest.Mock).mockReturnValue(d);

      const result = PaymentService.createInstallmentData(loanData);

      expect(result).toEqual(expectedInstallments);
    });

    it("should create installment data", () => {
      const d: Date = new Date();
      const loanData = {
        remainingAmount: 1000,
        noOfInstallments: 4,
        repaymentSchedule: {},
        createdAt: d,
      };

      const expectedInstallments = [
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
        { amount: 250, scheduleDate: d },
      ];

      (getDates as jest.Mock).mockReturnValue(d);

      const result = PaymentService.createInstallmentData(loanData);

      expect(result).toEqual(expectedInstallments);
    });
  });

  describe("markAsPaid", () => {
    it("should mark payment as paid", async () => {
      const paymentId = "encryptedPaymentId";
      const decryptedPaymentId = "1";
      const paymentObject = {
        id: 1,
        amount: 100,
        LoanModel: { id: 1, remainingAmount: 100 },
        status: Status.PENDING,
      };

      (EncryptionService.decrypt as jest.Mock).mockReturnValue(
        decryptedPaymentId
      );
      const mockGet = jest.spyOn(Payment.prototype, "get");
      mockGet.mockResolvedValueOnce(paymentObject);

      const mockUpdate = jest.spyOn(Payment.prototype, "update");
      mockUpdate.mockResolvedValueOnce({
        ...paymentObject,
        status: Status.PAID,
      });

      (new LoanTable().update as jest.Mock).mockImplementation(jest.fn());

      const result = await PaymentService.markAsPaid(paymentId);

      expect(result).toBe(true);
      expect(EncryptionService.decrypt).toHaveBeenCalledWith(paymentId);
      expect(Payment.prototype.get).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(
        { id: 1, status: Status.PENDING, amount: 100 },
        { status: Status.PAID }
      );
      expect(LoanTable.prototype.update).toHaveBeenCalledWith(
        { id: 1 },
        { remainingAmount: 0, status: "PAID" }
      );
    });

    it("should return false if payment does not exist", async () => {
      const paymentId = "encryptedPaymentId";
      const decryptedPaymentId = "1";

      (EncryptionService.decrypt as jest.Mock).mockReturnValue(
        decryptedPaymentId
      );
      (Payment.prototype.get as jest.Mock).mockResolvedValueOnce({
        toJSON: () => null,
      });

      const result = await PaymentService.markAsPaid(paymentId);

      expect(result).toBe(false);
    });

    it("should return false if paymentId is null", async () => {
      const result = await PaymentService.markAsPaid(null);

      expect(result).toBe(false);
    });
  });
});
