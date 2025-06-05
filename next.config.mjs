import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.nexgen-academy.com",
      "pre.nexgen-academy.com",
      "flagcdn.com",
      "localhost",
    ],
  },
};
export default withNextIntl(nextConfig);
