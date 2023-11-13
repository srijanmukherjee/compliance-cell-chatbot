/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		swcPlugins: [['@swc-jotai/react-refresh', {}]],
	}
}

module.exports = nextConfig
