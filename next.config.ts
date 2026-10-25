import type { NextConfig } from "next";

const config: NextConfig = {
  async redirects() {
    return [{ source: "/archive/:slug(shoumma-saha|mehedi-h)", destination: "/archive/artists/:slug", permanent: true }];
  },
};

export default config;
