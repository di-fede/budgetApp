/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `@import "@/sass/abstracts/_mixins.scss";`,
  }
};

export default nextConfig;
