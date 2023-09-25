import { expect } from "vitest";
import {
  isEnsName,
  isUnsName,
  shortAddress,
  truncate,
  isValidRecipientAddressFormat,
} from "../string";

describe("truncate", () => {
  it("should return the original string if its length is less than the length param", () => {
    expect(truncate("123 string", 10)).toBe("123 string");
  });
  it("should return a truncated string if its length is greater than the length param", () => {
    expect(truncate("123 string", 6)).toBe("123...");
  });
  it("should return an empty string for unexpected string input", () => {
    expect(truncate(undefined, 3)).toBe("");
  });
});

describe("isEnsName", () => {
  it("should return true if name ends with .eth", () => {
    expect(isEnsName("test.eth")).toBe(true);
  });
  it("should return false if name does not include eth", () => {
    expect(isEnsName("01201209483434")).toBe(false);
  });
  it("should return false if name includes but does not end with .eth", () => {
    expect(isEnsName("test.noteth")).toBe(false);
    expect(isEnsName("eth.test")).toBe(false);
  });
  it("should return false if invalid name", () => {
    expect(isEnsName("")).toBe(false);
  });
  it("should return true for cb.id names", () => {
    expect(isEnsName("test.cb.id")).toBe(true);
  });

  describe("shortAddress", () => {
    it("should return properly formatted address with long addresses that start with 0x", () => {
      const address = "0x3843594754958459849584232930739572065843";
      expect(shortAddress(address)).toBe("0x3843...5843");
    });
    it("should not format long addresses that do not start with 0x", () => {
      const address = "123843594754958459849584232930";
      expect(shortAddress(address)).toBe(address);
    });
    it("should not format short addresses that start with 0x", () => {
      const address = "0xabc";
      expect(shortAddress(address)).toBe(address);
    });
    it("should not format short addresses that do not start with 0x", () => {
      const address = "abc";
      expect(shortAddress(address)).toBe(address);
    });
    it("should handle empty string inputs by returning an empty string", () => {
      expect(shortAddress("")).toBe("");
    });
  });
});

describe("isUnsName", () => {
  it("should return true if name ends with .wallet", () => {
    expect(isUnsName("test.wallet")).toBe(true);
  });
  it("should return false if name does not end with any UNS suffix", () => {
    expect(isUnsName("01201209483434")).toBe(false);
  });
  it("should return false if name includes but does not end with .wallet", () => {
    expect(isUnsName("test.notwallet")).toBe(false);
    expect(isUnsName("wallet.test")).toBe(false);
  });
  it("should return false if invalid name", () => {
    expect(isUnsName("")).toBe(false);
  });
  it("should return true for subdomain .wallet names", () => {
    expect(isUnsName("test.test.wallet")).toBe(true);
  });
});

describe("isValidRecipientAddressFormat", () => {
  it("should return true if address ends with .eth", () => {
    expect(isValidRecipientAddressFormat("test.eth")).toBe(true);
  });
  it("should return true if address starts with 0x and is the right length", () => {
    expect(
      isValidRecipientAddressFormat(
        "0x1234567890123456789012345678901234567890",
      ),
    ).toBe(true);
  });
  it("should return false if address starts with 0x and is not the right length", () => {
    expect(isValidRecipientAddressFormat("0xwrongLength")).toBe(false);
  });
  it("should return false if invalid address", () => {
    expect(isValidRecipientAddressFormat("")).toBe(false);
  });
});
