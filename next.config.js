const withTM = require('next-transpile-modules')(['@vime/core', '@vime/react'])

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
	reactStrictMode: true,
	images: {
		dangerouslyAllowSVG: true,
		domains: ['avatar.tobi.sh', 'podquest.infura-ipfs.io', 'avatars.dicebear.com'],
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	experimental: {
		newNextLinkBehavior: true,
	},
})

module.exports = nextConfig
