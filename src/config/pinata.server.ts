import "server-only";

import { env } from "@/lib/env";
import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: `${env.PINATA_JWT}`,
  pinataGateway: `${env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});
