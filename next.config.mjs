// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: [
      "api.nexgen-academy.com",
      "development.nexgen-academy.com",
      "flagcdn.com",
      "localhost",
      "via.placeholder.com",
    ],
  },
};

export default withNextIntl(nextConfig);
