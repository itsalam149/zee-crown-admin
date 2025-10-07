/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'siltyntxitqkzjsngbcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
      {
        protocol: 'https',
        hostname: 'siltyntxitqkzjsngbcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/banners/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
