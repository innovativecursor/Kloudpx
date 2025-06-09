/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.myzow.in",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "c1-ebgames.eb-cdn.com.au",
        port: "",
        pathname: "/merchandising/images/**",
      },
    ],
  },
};

export default nextConfig;
