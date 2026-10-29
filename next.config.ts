import type { NextConfig } from "next";

const config: NextConfig = {
  // Keep production builds from overwriting the running dev server's assets.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: "https", hostname: "smtlecueburhxlarqlqg.supabase.co" },
      { protocol: "https", hostname: "norient.com" },
      { protocol: "https", hostname: "www.thedailystar.net" },
      { protocol: "https", hostname: "mixmag.asia" },
      { protocol: "https", hostname: "f4.bcbits.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/archive/:slug(shoummo-saha)", destination: "/featured/artists/:slug", permanent: true },
      { source: "/archive", destination: "/featured", permanent: true },
      { source: "/archive/:path*", destination: "/featured/:path*", permanent: true },
      { source: "/magazine", destination: "/editorial", permanent: true },
      { source: "/magazine/:path*", destination: "/editorial/:path*", permanent: true },
      { source: "/scenes", destination: "/discover", permanent: true },
      { source: "/scenes/:path*", destination: "/discover/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/featured", destination: "/archive" },
      { source: "/featured/:path*", destination: "/archive/:path*" },
      { source: "/editorial", destination: "/magazine" },
      { source: "/editorial/:path*", destination: "/magazine/:path*" },
      { source: "/discover", destination: "/scenes" },
      { source: "/discover/:path*", destination: "/scenes/:path*" },
    ];
  },
};

export default config;
