/** @type {import('next').NextConfig} */

const nextConfig = {
    // https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
    output: "standalone",
    experimental: {
        instrumentationHook: true,
    },
};

module.exports = nextConfig;
