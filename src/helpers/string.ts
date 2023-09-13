import { utils } from "ethers";
import { ALLOWED_ENS_SUFFIXES, ALLOWED_UNS_SUFFIXES } from "./constants";

export const truncate = (str: string | undefined, length: number): string => {
  if (!str) {
    return "";
  }
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }
  return str;
};

export const formatDate = (d: Date | undefined): string =>
  d ? d.toLocaleDateString("en-US") : "";

export const formatTime = (d: Date | undefined): string =>
  d
    ? d
        .toLocaleTimeString(undefined, {
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
        })
        // ICU 72.1 may use different unicode space characters
        .replace(/\u202f|\u2009/g, " ")
    : "";

export const isEnsAddress = (address: string): boolean => {
  // Bail out early if empty string or a string without any dots
  if (!address || !address.includes(".")) {
    return false;
  }

  return ALLOWED_ENS_SUFFIXES.some((suffix) => address.endsWith(suffix));
};

export const isUnsAddress = (address: string): boolean => {
  // Bail out early if empty string or a string without any dots
  if (!address || !address.includes(".")) {
    return false;
  }
  return ALLOWED_UNS_SUFFIXES.some((suffix) => address.endsWith(suffix));
};

type UnstoppableDomainsDomainResponse = {
  meta?: {
    resolver?: string;
    blockchain?: string;
    networkId?: number;
    registry?: string;
    domain?: string;
    namehash?: string;
    tokenId?: string;
    owner?: string;
    reverse?: boolean;
  };
};

type UnstoppableDomainsBulkDomainResponse = {
  data: Array<UnstoppableDomainsDomainResponse>;
};

export const fetchUnsName = async (
  address: string | undefined,
): Promise<string | null> => {
  if (import.meta.env.VITE_UNS_TOKEN && address) {
    try {
      const response = await fetch(
        `https://resolve.unstoppabledomains.com/reverse/${address.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_UNS_TOKEN}`,
          },
        },
      );

      const domainJson =
        (await response.json()) as UnstoppableDomainsDomainResponse;
      return domainJson?.meta?.domain ? domainJson?.meta?.domain : null;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

export const fetchUnsNames = async (
  addresses: string[],
): Promise<{ [key: string]: string } | null> => {
  if (import.meta.env.VITE_UNS_TOKEN && addresses?.length) {
    const result: { [key: string]: string } = {};
    if (addresses.length < 2) {
      const domain = await fetchUnsName(addresses[0]);
      if (domain) {
        result[addresses[0]] = domain;
      }
      return result;
    }
    try {
      const response = await fetch(
        `https://api.unstoppabledomains.com/resolve/reverse/query`,
        {
          method: "POST",
          body: JSON.stringify({ addresses }),
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_UNS_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      const domainJson = (
        (await response.json()) as UnstoppableDomainsBulkDomainResponse
      ).data;
      domainJson.forEach((domain) => {
        if (domain.meta?.owner) {
          result[domain.meta.owner] = domain.meta?.domain as string;
        }
      });
      return result;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

export const fetchUnsAddress = async (
  name: string | undefined,
): Promise<string | null> => {
  if (import.meta.env.VITE_UNS_TOKEN && name) {
    try {
      const response = await fetch(
        `https://api.unstoppabledomains.com/resolve/domains/${name}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_UNS_TOKEN}`,
          },
        },
      );
      const domainJson =
        (await response.json()) as UnstoppableDomainsDomainResponse;
      if (
        domainJson?.meta?.owner === "0x0000000000000000000000000000000000000000"
      )
        return null;
      return domainJson?.meta?.owner ? domainJson?.meta?.owner : null;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

export const isValidRecipientAddressFormat = (recipientWalletAddress: string) =>
  isEnsAddress(recipientWalletAddress) ||
  isUnsAddress(recipientWalletAddress) ||
  (recipientWalletAddress?.startsWith("0x") &&
    recipientWalletAddress?.length === 42);

export const isValidLongWalletAddress = (recipientWalletAddress: string) =>
  recipientWalletAddress?.startsWith("0x") &&
  recipientWalletAddress?.length === 42;

export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;

export const getAddress = (conversationTopic: string) => {
  let addr;
  try {
    addr = utils.getAddress(conversationTopic);
  } catch {
    addr = conversationTopic;
  }
  return addr;
};
