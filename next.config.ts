import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools/content-calander",
        destination: "/tools/content-calendar",
        permanent: true,
      },
      {
        source: "/tools/client-calculator",
        destination: "/tools/clients-financial-calculator",
        permanent: true,
      },
      {
        source: "/tools/ecommerce-profit-calculator",
        destination: "/tools/ecommerce-calculator",
        permanent: true,
      },
      {
        source: "/tools/passport-photo",
        destination: "/tools/passport-photo-maker",
        permanent: true,
      },
      {
        source: "/tools/id-cards",
        destination: "/tools/id-card-maker",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
