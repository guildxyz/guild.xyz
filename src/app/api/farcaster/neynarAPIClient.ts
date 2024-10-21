import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import { env } from "env"

export const neynarAPIClient = new NeynarAPIClient(env.NEYNAR_API_KEY)
