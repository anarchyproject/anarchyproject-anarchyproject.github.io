/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  webpack: config => {
    config.externals.push('encoding');
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
