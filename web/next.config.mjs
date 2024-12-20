/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/bounty',
        permanent: true,
        locale: false
      },
      {
        source: '/admin',
        destination: '/admin/bounty',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
