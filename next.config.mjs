/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `@use "@/sass/abstracts/_mixins.scss" as *;`,
  }
};

export default nextConfig;
