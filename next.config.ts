import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

if (!basePath && isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
  if (repoName && !repoName.endsWith(".github.io")) {
    basePath = `/${repoName}`;
  }
}

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://188.212.99.215:8080/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://188.212.99.215:8080/uploads/:path*",
      },
    ];
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

