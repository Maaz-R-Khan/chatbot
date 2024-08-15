import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        config.resolve.modules.push(path.resolve("./"));

        return config;
    }
};

export default nextConfig;
