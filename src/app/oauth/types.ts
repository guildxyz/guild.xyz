import { PlatformName } from "@guildxyz/types"
import { OneOf } from "types"

export type OAuthResponse = {
  error_description?: string
  error?: string
  csrfToken: string
  platformName: PlatformName
} & Record<string, any>

export type OAuthLocalStorageInfo = {
  csrfToken: string
  from: string
  redirect_url: string
  scope: string
}

export type Message = OneOf<
  { type: "OAUTH_ERROR"; data: { error: string; errorDescription: string } },
  { type: "OAUTH_SUCCESS"; data: any }
>
