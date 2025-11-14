/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cf.shopee.com.br',
                port: '',
                pathname: '/file/**',
            },
        ],
    },
};

export default nextConfig;
