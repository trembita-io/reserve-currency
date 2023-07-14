/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src", "app"),
      path.join(__dirname, "src", "pages"),
      path.join(__dirname, "src", "styles"),
    ],
  },
};

module.exports = nextConfig;
