import * as secp from "@noble/secp256k1";

export const bytesToHex = secp.utils.bytesToHex;

export function hexToBytes(s: string): Uint8Array {
  if (s.startsWith("0x")) {
    s = s.slice(2);
  }
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const j = i * 2;
    bytes[i] = Number.parseInt(s.slice(j, j + 2), 16);
  }
  return bytes;
}

export const shortAddress = (addr: string): string =>
  addr.length > 10 && addr.startsWith("0x")
    ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    : addr;
