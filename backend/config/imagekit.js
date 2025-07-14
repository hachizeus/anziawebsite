import ImageKit from 'imagekit';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_H8E1FcBEot64DXwBnuZfDWo8Xdg=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_7uExzNdUnDZzv3vUi5gz5LzE3mo=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/kja8ahxxu',
});

export default imagekit;
