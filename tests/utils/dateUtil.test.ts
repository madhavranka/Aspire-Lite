import { getDates } from "../../src/utils/dateUtil";

describe("getDates", () => {
  it("should add days to the start date", () => {
    const startDate = "2024-02-07";
    const result = getDates(3, "D", startDate);
    expect(result).toEqual(new Date("2024-02-10"));
  });

  it("should add weeks to the start date", () => {
    const startDate = "2024-02-07";
    const result = getDates(3, "W", startDate);
    expect(result).toEqual(new Date("2024-02-28"));
  });

  it("should add months to the start date", () => {
    const startDate = "2024-02-07";
    const result = getDates(3, "M", startDate);
    expect(result).toEqual(new Date("2024-05-07"));
  });

  it("should throw an error for invalid period", () => {
    const startDate = "2024-02-07";
    expect(() => getDates(3, "Y", startDate)).toThrow("Invalid period: Y");
  });

  it("should handle date as a number (timestamp)", () => {
    const startDate = new Date("2024-02-07").getTime();
    const result = getDates(3, "D", startDate);
    expect(result).toEqual(new Date("2024-02-10"));
  });

  it("should handle date as a Date object", () => {
    const startDate = new Date("2024-02-07");
    const result = getDates(3, "D", startDate);
    expect(result).toEqual(new Date("2024-02-10"));
  });

  it("should handle negative values for days", () => {
    const startDate = "2024-02-07";
    const result = getDates(-3, "D", startDate);
    expect(result).toEqual(new Date("2024-02-04"));
  });

  it("should handle negative values for weeks", () => {
    const startDate = "2024-02-07";
    const result = getDates(-1, "W", startDate);
    expect(result).toEqual(new Date("2024-01-31"));
  });

  it("should handle negative values for months", () => {
    const startDate = "2024-02-07";
    const result = getDates(-1, "M", startDate);
    expect(result).toEqual(new Date("2024-01-07"));
  });
});
