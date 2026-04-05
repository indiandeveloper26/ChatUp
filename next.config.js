// /**
//  * @type {import('next').NextConfig}
//  */
// const nextConfig = {
//   output: 'export',
//   trailingSlash: true // 👉 static export में recommended है
// };

// module.exports = nextConfig;




// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['placekitten.com'], // yahan external image domains add karo
  },

  /* config options here */
}

module.exports = nextConfig