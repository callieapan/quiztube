/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default nextConfig;
