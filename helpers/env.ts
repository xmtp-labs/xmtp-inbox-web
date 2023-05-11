import { ENVIRONMENT } from "./constants";

export const getEnv = (): "dev" | "production" | "local" => {
  const envVar = process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT;
  if (envVar === "production") {
    return envVar;
  }
  if (envVar === "local") {
    return envVar;
  }
  return "dev";
};

export const isAppEnvDemo = (): boolean => {
  return true;
  return (
    window.location.hostname.includes(ENVIRONMENT.DEMO) ||
    // Added for E2E testing
    localStorage.getItem(ENVIRONMENT.DEMO) === String(true)
  );
};

export const isAppEnvAlpha = (): boolean => {
  return window.location.hostname.includes("alpha");
};

export const tagStr = (): string | null => {
  return getEnv() === "production" ? null : getEnv().toLocaleUpperCase();
};

export const getGoogleTagId = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "";
};
