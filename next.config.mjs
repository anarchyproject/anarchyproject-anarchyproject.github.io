/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  transpilePackages: [
    '@uniswap/widgets',
    '@uniswap/conedison'
  ],
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
