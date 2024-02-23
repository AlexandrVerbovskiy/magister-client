/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // For Static Export
  // output: 'export',
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  optimizeFonts: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
