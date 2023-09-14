declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpeg" {
  const content: any;
  export default content;
}

declare module "vite-plugin-rewrite-all" {
  import type { ViteDevServer } from "vite";

  declare function redirectAll(): {
    name: string;
    configureServer(server: ViteDevServer): () => void;
  };

  export default redirectAll;
}

declare module "react-blockies" {
  import type React from "react";

  interface BlockiesProps {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
  }
  const Blockies: React.FC<BlockiesProps>;

  export default Blockies;
}

interface ImportMeta {
  env: {
    VITE_INFURA_ID: string;
    VITE_DATA_DOG_ID: string;
    VITE_DATA_DOG_TOKEN: string;
    VITE_WEB3_STORAGE_TOKEN: string;
    VITE_XMTP_API_URL: string;
    VITE_XMTP_ENVIRONMENT: string;
    VITE_GOOGLE_TAG_ID: string | undefined;
    VITE_UNS_TOKEN: string;
    VITE_PROJECT_ID: string;
  };
}
