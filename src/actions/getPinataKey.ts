"use server";

import { pinata } from "@/config/pinata.server";

export const getPinataKey = async () => {
  const uuid = crypto.randomUUID();
  const keyData = await pinata.keys.create({
    keyName: uuid.toString(),
    permissions: {
      endpoints: {
        pinning: {
          pinFileToIPFS: true,
        },
      },
    },
    maxUses: 1,
  });
  return keyData;
};
