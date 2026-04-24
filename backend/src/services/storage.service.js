import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export const uploadImage = async ({ buffer, fileName, folder = "snitch" }) => {
  const result = await client.upload({
    file: buffer,
    fileName,
    folder,
  });

  return result;
};
