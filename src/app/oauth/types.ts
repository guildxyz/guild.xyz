import { PlatformName } from "@guildxyz/types"

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
