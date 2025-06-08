/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    
    // Support WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    return config;
  },
};

export default nextConfig;
