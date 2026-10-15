/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  output: "standalone",
  poweredByHeader: false,
  // The backend connection values live in VITE_SUPABASE_* (publishable key only);
  // map them to the NEXT_PUBLIC_* names the app code reads so both the server
  // bundle and the browser bundle receive them at build time.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
  },
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://*.supabase.co; form-action 'self'; upgrade-insecure-requests" }
      ]
    }]
  }
};
export default nextConfig;
