/** @type {import('next').NextConfig} */
const path = require("path");
const fs = require("fs");

const buildCssFile = (baseFolderPath, buildFolderPath, filename) => {
  const source = path.resolve(__dirname, baseFolderPath, filename);
  const destination = path.resolve(
    __dirname,
    "public/css",
    buildFolderPath,
    filename
  );

  if (!fs.existsSync(path.dirname(destination))) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
  }

  fs.copyFileSync(source, destination);

  fs.watch(
    path.resolve(__dirname, baseFolderPath),
    (eventType, eventFilename) => {
      if (eventFilename === filename && eventType === "change") {
        fs.copyFileSync(source, destination);
      }
    }
  );
};

const buildBaseCssFile = (filename) => buildCssFile("styles", "base", filename);

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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    buildBaseCssFile("bootstrap.min.css");
    buildBaseCssFile("animate.min.css");
    buildBaseCssFile("boxicons.min.css");
    buildBaseCssFile("flaticon.css");

    buildCssFile("node_modules/swiper", "base", "swiper.css");
    buildCssFile("node_modules/swiper", "base", "swiper-bundle.css");

    buildBaseCssFile("style.css");
    buildBaseCssFile("responsive.css");
    buildBaseCssFile("rtl.css");

    return config;
  },
};

module.exports = nextConfig;
