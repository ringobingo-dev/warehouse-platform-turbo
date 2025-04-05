/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize chunk loading
  webpack: (config, { isServer }) => {
    // Optimize chunk size
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 200000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: "framework",
          test: /[\\/]node_modules[\\/](@react|react|react-dom|next|scheduler)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace("@", "")}`
          },
          priority: 30,
        },
      },
    }

    // Add this to prevent chunk loading errors
    config.output.chunkLoadingGlobal = `webpackChunk_${Date.now()}`

    return config
  },
  async redirects() {
    return [
      {
        source: "/room-dimensions",
        destination: "/dimensions",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

