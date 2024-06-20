/** @type {import('next').NextConfig} */
/** serverComponentsExternalPackage introduced on June 20, 2024 to resolve EmptyChannelError in LangGraph in NextJs Prod */
/** Bug was not reproducable in Dev */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: {
        serverComponentsExternalPackages: ["@langchain/langgraph"],
    },
}

export default nextConfig;
