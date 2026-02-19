/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "new.sahlsale.work",
            },
        ],
    },
};

export default nextConfig;
