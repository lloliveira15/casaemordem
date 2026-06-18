import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  transpilePackages: ["phosphor-react"],
}

export default nextConfig
