import ImageKit from 'imagekit';

// Initialize ImageKit with the provided credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_ahoxvdF2fShMnKvheyP8TQrAKhE=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_2giGXPBneW+SEkkpeZIG7djjhqw=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/q5jukn457'
});

export default imagekit;