import { PlatformName } from "@guildxyz/types"

export type OAuthResultParams =
  | {
      status: "success"
      platform: PlatformName
      path: string
    }
  | {
      status: "error"
      message: string
      platform?: PlatformName
      path?: string
    }
