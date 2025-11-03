/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol : 'https',
        hostname : "ferf1mheo22r9ira.public.blob.vercel-storage.com",
      }, {
        protocol : "https",
        "hostname" : "www.vilvahstore.com"
      }
    ],
  },
};

export default nextConfig;
