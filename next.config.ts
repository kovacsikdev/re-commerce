import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['three', '@react-three/fiber', 'react-reconciler']
}
 
export default nextConfig