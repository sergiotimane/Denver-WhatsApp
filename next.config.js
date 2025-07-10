/** @type {import('next').NextConfig} */
const nextConfig = {
	output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
	typescript: {
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
