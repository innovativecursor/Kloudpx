// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "cms.myzow.in",
//         port: "",
//         pathname: "/images/**",
//       },
//       {
//         protocol: "https",
//         hostname: "c1-ebgames.eb-cdn.com.au",
//         port: "",
//         pathname: "/merchandising/images/**",
//       },
//       {
//         protocol: "https",
//         hostname: "kloudpx.s3.ap-southeast-1.amazonaws.com",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;





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
      {
        protocol: "https",
        hostname: "kloudpx.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // 👇 ye part add karo
  devIndicators: {
    buildActivity: false,
  },
  onDemandEntries: {
    overlay: false, // error overlay disable karega
  },
};

export default nextConfig;
