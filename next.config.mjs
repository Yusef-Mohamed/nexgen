import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
