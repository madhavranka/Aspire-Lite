// tests/services/PaymentService.test.ts
import PaymentService from "../../src/services/PaymentService";
import PaymentModel, { Status } from "../../src/database/models/payment";
import EncryptionService from "../../src/services/EncryptionService";
import Loan from "../../src/models/Loan";
import Payment from "../../src/models/Payment";
import { getDates } from "../../src/utils/dateUtil";

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

      (PaymentModel.create as jest.Mock).mockResolvedValueOnce(paymentData);

      await PaymentService.createPaymentEntry(paymentData);

      expect(PaymentModel.create).toHaveBeenCalledWith(paymentData);
    });

    it("should throw an error when creation fails", async () => {
      const paymentData = {
        amount: 100,
        loanId: 1,
        customerId: 1,
        status: Status.PENDING,
        currency: "USD",
      };

      (PaymentModel.create as jest.Mock).mockRejectedValueOnce(
        new Error("Error creating payment entry")
      );

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
    it("should create installment data", () => {
      const loanData = {
        remainingAmount: 1000,
        noOfInstallments: 4,
        repaymentSchedule: { frequency: 1, type: "W" },
        createdAt: new Date(),
      };

      const expectedInstallments = [
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
      ];

      (getDates as jest.Mock).mockReturnValue(new Date());

      const result = PaymentService.createInstallmentData(loanData);

      expect(result).toEqual(expectedInstallments);
    });

    it("should create installment data", () => {
      const loanData = {
        remainingAmount: 1000,
        noOfInstallments: 4,
        repaymentSchedule: {},
        createdAt: new Date(),
      };

      const expectedInstallments = [
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
        { amount: 250, scheduleDate: new Date() },
      ];

      (getDates as jest.Mock).mockReturnValue(new Date());

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
      (Payment.prototype.get as jest.Mock).mockResolvedValueOnce({
        toJSON: () => paymentObject,
      });
      (Payment.update as jest.Mock).mockResolvedValueOnce({
        toJSON: () => ({ ...paymentObject, status: Status.PAID }),
      });
      (Loan.update as jest.Mock).mockImplementation(jest.fn());

      const result = await PaymentService.markAsPaid(paymentId);

      expect(result).toBe(true);
      expect(EncryptionService.decrypt).toHaveBeenCalledWith(paymentId);
      expect(Payment.prototype.get).toHaveBeenCalled();
      expect(Payment.update).toHaveBeenCalledWith(
        { id: 1, status: Status.PENDING, amount: 100 },
        { status: Status.PAID }
      );
      expect(Loan.update).toHaveBeenCalledWith(
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
