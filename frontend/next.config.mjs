/** @type {import('next').NextConfig} */
const nextConfig = {

    reactStrictMode: true,
    images: {
      domains: [
        'res.cloudinary.com',
        'i.pravatar.cc',
        'avatar.iran.liara.run',
        'dummyimage.com',
      ],
      // You can add more domains here if needed
    },
};

export default nextConfig;
