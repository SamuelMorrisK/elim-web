const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "1337", pathname: "/uploads/**" },
      { protocol: "https", hostname: "pub-ee00b46438954b42b4b3e09b60cb3c9d.r2.dev", pathname: "/**" },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;